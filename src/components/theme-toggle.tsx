"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Pinned to the top-right corner, mirroring the social rail at bottom-right.
 * Chromeless by design — no border or fill, so it reads as part of the page.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="fixed right-4 top-4 z-[60] grid size-8 place-items-center rounded-md text-faint opacity-60 transition-all duration-300 ease-out hover:scale-110 hover:text-accent hover:opacity-100 no-print sm:right-6 sm:top-5"
    >
      {/* Render nothing icon-wise until mounted so SSR and client agree. */}
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="size-3.5" />
        ) : (
          <Moon className="size-3.5" />
        )
      ) : (
        <span className="size-3.5" />
      )}
    </button>
  );
}
