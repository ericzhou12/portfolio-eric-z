import { NowPlayingLine } from "@/features/music/now-playing-line";
import { profile } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line py-5">
      {/* Right padding keeps the copy clear of the fixed social rail. */}
      <div className="flex flex-col gap-3 pr-28 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="flex flex-wrap items-center gap-2 font-mono">
          <NowPlayingLine />
        </p>
      </div>
    </footer>
  );
}
