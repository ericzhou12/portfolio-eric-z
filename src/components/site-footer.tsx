"use client";

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
        <p className="font-mono">
          Press{" "}
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[0.6875rem] text-muted">
            {shortcut}
          </kbd>{" "}
          anywhere · built with Next.js
        </p>
      </div>
    </footer>
  );
}
