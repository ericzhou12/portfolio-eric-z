import { profile } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-10">
      <div className="flex flex-col gap-3 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono">
          Press{" "}
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[0.6875rem] text-muted">
            ⌘K
          </kbd>{" "}
          anywhere · built with Next.js
        </p>
      </div>
    </footer>
  );
}
