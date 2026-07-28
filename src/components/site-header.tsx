"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Download, Moon, Sun } from "lucide-react";
import { profile, sections } from "@/lib/content";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-fg"
    >
      {/* Render nothing icon-wise until mounted so SSR and client agree. */}
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the last section whose heading has passed the header wins.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
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
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight text-fg"
        >
          eric zhou
          <span className="text-accent">.</span>
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={
                    activeSection === section.id ? "true" : undefined
                  }
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    activeSection === section.id
                      ? "text-fg"
                      : "text-muted hover:text-fg",
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("open-command-palette"))
            }
            aria-label="Open command palette"
            className="hidden items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 text-xs text-faint transition-colors hover:text-fg sm:flex"
          >
            <span className="font-mono">⌘K</span>
          </button>
          <ThemeToggle />
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-fg px-3.5 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            <Download className="size-3.5" aria-hidden />
            Résumé
          </a>
        </div>
      </div>
    </header>
  );
}
