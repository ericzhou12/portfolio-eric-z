"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { profile } from "@/lib/content";
import { cn } from "@/lib/utils";

export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context, denied permission) —
      // fall back to opening the mail client so the action still works.
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : `Copy email: ${profile.email}`}
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-fg",
        className,
      )}
    >
      <span className="truncate">{profile.email}</span>
      {copied ? (
        <Check className="size-4 shrink-0 text-accent" aria-hidden />
      ) : (
        <Copy
          className="size-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
