import { Github, Linkedin } from "lucide-react";
import { profile } from "@/lib/content";

const links = [
  { label: "GitHub", href: profile.github, icon: Github },
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
];

/**
 * Persistent, low-weight social links pinned to the bottom-right corner.
 * They sit at half opacity until hovered, then lift and unfurl their label.
 */
export function SocialRail() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1 no-print sm:bottom-6 sm:right-6">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="group flex items-center rounded-full border border-transparent px-2.5 py-2 text-faint opacity-60 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-line hover:bg-surface/80 hover:text-accent hover:opacity-100 hover:shadow-sm"
          >
            <Icon
              className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
              aria-hidden
            />
            <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap font-mono text-xs opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-28 group-hover:opacity-100">
              {link.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
