"use client";

import { useEffect, useState } from "react";
import type { NowPlaying } from "@/features/music/now-playing";

// Tighter cadence while a track is live so a song change lands quickly; songs
// are ~3min, so idle polling can stay lazy. 5s keeps even a permanently-focused
// tab inside the monthly function budget, which 1s did not.
const POLL_LIVE_MS = 5_000;
const POLL_IDLE_MS = 30_000;

// Module-level so the hero and the footer share one poller instead of each
// firing its own request every 30s.
let current: NowPlaying | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let controller: AbortController | null = null;
let running = false;
const subscribers = new Set<(value: NowPlaying | null) => void>();

function isLive(track: NowPlaying | null) {
  return Boolean(track && !track.empty && track.playing);
}

// Identity of what the UI actually renders — polls that return the same track
// should not re-render every subscriber.
function key(track: NowPlaying | null) {
  if (!track || track.empty) return "empty";
  return `${track.playing}:${track.artist}:${track.title}`;
}

async function load() {
  controller?.abort();
  controller = new AbortController();
  try {
    const res = await fetch("/api/now-playing", {
      cache: "no-store",
      signal: controller.signal,
    });
    const next = (await res.json()) as NowPlaying;
    const changed = key(next) !== key(current);
    current = next;
    if (changed) subscribers.forEach((notify) => notify(next));
  } catch {
    // Aborts and network blips both leave the last value in place.
  }
}

async function tick() {
  await load();
  if (running) arm();
}

// A visible-but-unfocused tab (second monitor, split screen) isn't being read,
// so it drops to the lazy cadence — a parked tab can't drain the function
// budget, which is the only way 1s polling gets expensive.
function nextDelay() {
  return isLive(current) && document.hasFocus() ? POLL_LIVE_MS : POLL_IDLE_MS;
}

function arm() {
  clearTimeout(timer);
  timer = setTimeout(tick, nextDelay());
}

function start() {
  if (running) return;
  running = true;
  void tick();
}

// Refocusing shouldn't wait out a 30s timer that was armed while unfocused.
function refresh() {
  if (!running) return;
  clearTimeout(timer);
  void tick();
}

function stop() {
  running = false;
  clearTimeout(timer);
  timer = undefined;
}

export function useNowPlaying() {
  const [track, setTrack] = useState<NowPlaying | null>(current);

  useEffect(() => {
    subscribers.add(setTrack);
    setTrack(current);

    // An idle background tab should not keep polling, and coming back should
    // refresh immediately rather than wait out the interval.
    const onVisibility = () => (document.hidden ? stop() : start());
    const onPageShow = () => {
      if (!document.hidden) start();
    };
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", refresh);

    return () => {
      subscribers.delete(setTrack);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", refresh);
      if (subscribers.size === 0) {
        stop();
        controller?.abort();
      }
    };
  }, []);

  return track;
}
