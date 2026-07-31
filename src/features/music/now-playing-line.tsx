"use client";

import { Equalizer } from "@/features/music/equalizer";
import { TrackCover } from "@/features/music/track-cover";
import { profile } from "@/lib/content";
import { useNowPlaying } from "@/features/music/use-now-playing";

function agoLabel(playedAt: number) {
  const mins = Math.round((Date.now() - playedAt) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function NowPlayingLine() {
  const track = useNowPlaying();

  if (!track || track.empty) return null;
  if (!track.playing && !track.playedAt) return null;

  return (
    <>
      <span aria-hidden>·</span>
      <a
        href={profile.lastfm}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 transition-colors hover:text-fg"
      >
        {track.playing ? <Equalizer /> : <span aria-hidden>♪</span>}
        <span>{track.playing ? "currently playing:" : "last played:"}</span>
        {track.art ? <TrackCover src={track.art} /> : null}
        <span className="max-w-[14rem] truncate">
          {track.artist} — {track.title}
        </span>
        {!track.playing && track.playedAt ? (
          <span className="opacity-70">{agoLabel(track.playedAt)}</span>
        ) : null}
      </a>
    </>
  );
}
