"use client";

import { Equalizer } from "@/features/music/equalizer";
import { TrackCover } from "@/features/music/track-cover";
import { profile } from "@/lib/content";
import { useNowPlaying } from "@/features/music/use-now-playing";

// Purple field behind the status line. Unclipped, so the blur bleeds past the
// text — body's `overflow-x: clip` is what keeps that from widening the page.
// `y` values sit above 50 on purpose: they push the field's visual mass down
// onto the text instead of letting the largest blobs ride above it
const height = 80;

const BLOBS = [
  {
    color: "#4e2a84",
    x: 12,
    y: height+10,
    size: 320,
    duration: 24,
    delay: -8,
    morphDuration: 30,
    morphDelay: 0,
    drift: [35, -20, -30, 25, 20, -25],
    shapes: [
      "50% 50% 40% 60% / 60% 30% 70% 40%",
      "40% 60% 55% 45% / 45% 55% 35% 65%",
      "55% 45% 50% 50% / 35% 65% 50% 50%",
      "45% 55% 60% 40% / 55% 45% 40% 60%",
    ],
  },
  {
    color: "#7c4dcc",
    x: 30,
    y: height-6,
    size: 285,
    duration: 20,
    delay: 0,
    morphDuration: 26,
    morphDelay: -7,
    drift: [55, -30, -44, 35, 30, -39],
    shapes: [
      "30% 70% 70% 30% / 30% 30% 70% 70%",
      "60% 40% 35% 65% / 55% 45% 50% 50%",
      "45% 55% 60% 40% / 40% 60% 45% 55%",
      "70% 30% 40% 60% / 50% 50% 35% 65%",
    ],
  },
  {
    color: "#b49aef",
    x: 48,
    y: height+24,
    size: 255,
    duration: 25,
    delay: -5,
    morphDuration: 34,
    morphDelay: -12,
    drift: [-39, 35, 49, -30, -44, 25],
    shapes: [
      "70% 30% 30% 70% / 60% 40% 60% 40%",
      "35% 65% 55% 45% / 45% 55% 40% 60%",
      "55% 45% 40% 60% / 35% 65% 55% 45%",
      "40% 60% 65% 35% / 55% 45% 35% 65%",
    ],
  },
  {
    color: "#9b6dff",
    x: 66,
    y: height-2,
    size: 235,
    duration: 18,
    delay: -10,
    morphDuration: 22,
    morphDelay: -4,
    drift: [-69, 39, 60, -44, 44, 49],
    shapes: [
      "40% 60% 30% 70% / 50% 60% 40% 50%",
      "65% 35% 50% 50% / 40% 60% 55% 45%",
      "35% 65% 60% 40% / 60% 40% 35% 65%",
      "55% 45% 45% 55% / 35% 65% 60% 40%",
    ],
  },
  {
    color: "#5b3fa8",
    x: 82,
    y: height+12,
    size: 220,
    duration: 22,
    delay: -3,
    morphDuration: 28,
    morphDelay: -9,
    drift: [-60, -35, 44, 49, -35, -44],
    shapes: [
      "60% 40% 70% 30% / 40% 50% 60% 50%",
      "45% 55% 35% 65% / 55% 45% 40% 60%",
      "50% 50% 55% 45% / 40% 60% 50% 50%",
      "35% 65% 45% 55% / 60% 40% 55% 45%",
    ],
  },
];

function BlobField() {
  return (
    <div
      aria-hidden
      className="blob-field pointer-events-none absolute left-0 top-1/2 h-64 w-[34rem] -translate-y-1/2"
    >
      {BLOBS.map((blob) => (
        <div
          key={blob.color}
          className="blob"
          style={
            {
              backgroundColor: blob.color,
              width: blob.size,
              height: blob.size,
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              "--drift-duration": `${blob.duration}s`,
              "--drift-delay": `${blob.delay}s`,
              "--morph-duration": `${blob.morphDuration}s`,
              "--morph-delay": `${blob.morphDelay}s`,
              "--shape1": blob.shapes[0],
              "--shape2": blob.shapes[1],
              "--shape3": blob.shapes[2],
              "--shape4": blob.shapes[3],
              "--dx1": `${blob.drift[0]}px`,
              "--dy1": `${blob.drift[1]}px`,
              "--dx2": `${blob.drift[2]}px`,
              "--dy2": `${blob.drift[3]}px`,
              "--dx3": `${blob.drift[4]}px`,
              "--dy3": `${blob.drift[5]}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function StatusLine() {
  const track = useNowPlaying();
  const live = track && !track.empty && track.playing ? track : null;

  if (!live) {
    return (
      <div className="flex items-center gap-2.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        <span className="label-caps">{profile.status}</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2.5">
      <BlobField />
      <Equalizer />
      <span className="relative label-caps">now playing:</span>
      <a
        href={profile.lastfm}
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex max-w-[20rem] items-center gap-1.5 font-mono text-[0.6875rem] tracking-wide text-muted transition-colors hover:text-fg"
      >
        {live.art ? <TrackCover src={live.art} /> : null}
        <span className="truncate">
          {live.artist} — {live.title}
        </span>
      </a>
    </div>
  );
}
