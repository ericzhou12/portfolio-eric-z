"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { navigation, profile } from "@/lib/content";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

/**
 * ⌘K / Ctrl+K palette. Everything a recruiter needs — resume, email, links,
 * any page — one keystroke away, without hunting through the site.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      close();
      router.push(href);
    };
    const openUrl = (url: string) => () => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    };

    return [
      {
        id: "resume",
        label: "Download résumé (PDF)",
        hint: "File",
        keywords: "resume cv pdf download curriculum vitae",
        icon: FileText,
        run: openUrl(profile.resume),
      },
      {
        id: "email",
        label: "Copy email address",
        hint: profile.email,
        keywords: "email copy contact reach out mail hire",
        icon: copied ? Check : Copy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
          close();
        },
      },
      {
        id: "mailto",
        label: "Send me an email",
        hint: "Compose",
        keywords: "email mailto write contact hire recruit",
        icon: Mail,
        run: () => {
          close();
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "github",
        label: "GitHub",
        hint: "github.com/ericzhou12",
        keywords: "github code repos source projects",
        icon: Github,
        run: openUrl(profile.github),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: "in/erichyzhou",
        keywords: "linkedin profile network connect",
        icon: Linkedin,
        run: openUrl(profile.linkedin),
      },
      ...navigation.map((item) => ({
        id: `go-${item.href}`,
        label: `Go to ${item.label}`,
        hint: "Page",
        keywords: `${item.label} jump navigate open page`,
        icon: ArrowUpRight,
        run: go(item.href),
      })),
      {
        id: "theme",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`,
        hint: "Appearance",
        keywords: "theme dark light mode appearance toggle",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          close();
        },
      },
    ];
  }, [close, copied, resolvedTheme, router, setTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.keywords}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Global open/close shortcut.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  // Opening the palette should trap scroll and focus the input.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focus = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(focus);
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Let other components (the header button) open the palette too.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-command-palette", onOpen);
    return () => window.removeEventListener("open-command-palette", onOpen);
  }, []);

  function onInputKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      results[active]?.run();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-faint" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Jump to a page, grab my résumé, copy my email…"
            aria-label="Search commands"
            className="w-full bg-transparent py-4 text-sm text-fg outline-none placeholder:text-faint"
          />
          <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[0.625rem] text-faint sm:block">
            ESC
          </kbd>
        </div>

        <ul ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-faint">
              Nothing matches “{query}”
            </li>
          ) : (
            results.map((command, index) => {
              const Icon = command.icon;
              return (
                <li key={command.id}>
                  <button
                    type="button"
                    data-index={index}
                    onClick={command.run}
                    onMouseMove={() => setActive(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      index === active
                        ? "bg-accent/10 text-fg"
                        : "text-muted hover:bg-accent/5",
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-accent" />
                    <span className="flex-1 truncate">{command.label}</span>
                    <span className="hidden shrink-0 font-mono text-[0.6875rem] text-faint sm:block">
                      {command.hint}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
