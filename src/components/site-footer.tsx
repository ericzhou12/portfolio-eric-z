"use client";

import { NowPlayingLine } from "@/features/music/now-playing-line";
import { profile } from "@/lib/content";
import { useModifierKey } from "@/lib/use-modifier-key";

export function SiteFooter() {
  const shortcut = useModifierKey();

  return (
    <footer className="mt-auto border-t border-line py-5">
      {/* Right padding keeps the copy clear of the fixed social rail. */}
      <div className="flex flex-col gap-3 pr-28 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="flex flex-wrap items-center gap-2 font-mono">
          <span>
            Press{" "}
            <kbd className="rounded border border-line px-1.5 py-0.5 text-[0.6875rem] text-muted">
              {shortcut}
            </kbd>{" "}
            anywhere
          </span>
          <NowPlayingLine />
        </p>
      </div>
    </footer>
  );
}
