"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/content";
import { useModifierKey } from "@/lib/use-modifier-key";
import { cn, shell } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const shortcut = useModifierKey();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors no-print",
        scrolled
          ? "border-line bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className={cn(shell, "flex h-16 items-center justify-between gap-4")}>
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-fg"
        >
          eric zhou
          <span className="text-accent">.</span>
        </Link>

        <nav aria-label="Pages">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors",
                      active ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right padding clears the theme toggle pinned to the viewport corner. */}
        <div className="flex items-center gap-2 pr-9 sm:pr-7 lg:pr-0">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("open-command-palette"))
            }
            aria-label="Open command palette"
            className="hidden items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-xs text-faint transition-colors hover:text-fg sm:flex"
          >
            <span className="font-mono">{shortcut}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
