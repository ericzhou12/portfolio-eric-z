"use client";

import { useEffect, useState } from "react";
import type { NowPlaying } from "@/lib/now-playing";

const POLL_MS = 30_000;

// Module-level so the hero and the footer share one poller instead of each
// firing its own request every 30s.
let current: NowPlaying | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
let controller: AbortController | null = null;
const subscribers = new Set<(value: NowPlaying | null) => void>();

async function load() {
  controller?.abort();
  controller = new AbortController();
  try {
    const res = await fetch("/api/now-playing", { signal: controller.signal });
    current = (await res.json()) as NowPlaying;
    subscribers.forEach((notify) => notify(current));
  } catch {
    // Aborts and network blips both leave the last value in place.
  }
}

function start() {
  if (timer) return;
  void load();
  timer = setInterval(load, POLL_MS);
}

function stop() {
  clearInterval(timer);
  timer = undefined;
}

export function useNowPlaying() {
  const [track, setTrack] = useState<NowPlaying | null>(current);

  useEffect(() => {
    subscribers.add(setTrack);
    setTrack(current);

    // An idle background tab should not keep polling.
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      subscribers.delete(setTrack);
      document.removeEventListener("visibilitychange", onVisibility);
      if (subscribers.size === 0) {
        stop();
        controller?.abort();
      }
    };
  }, []);

  return track;
}
