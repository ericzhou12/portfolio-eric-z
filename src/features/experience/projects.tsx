import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { projects } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <Section
      id="projects"
      index="02"
      title="Projects"
      intro="Things I built end to end — shipped, measured, and in front of real users or judges."
      tight
    >
      <ol className="overflow-hidden rounded-xl border border-line bg-surface">
        {projects.map((project, index) => (
          <li key={project.id} className="border-t border-line first:border-t-0">
            <Reveal delay={index * 60}>
              {/* Same click-anywhere disclosure as the experience rows. */}
              <details className="group/row">
                <summary className="flex cursor-pointer list-none flex-col p-5 transition-colors hover:bg-accent-soft/40 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-base font-semibold tracking-tight">
                      {project.title}
                    </h3>
                    <span className="flex shrink-0 items-baseline gap-2 font-mono text-xs text-faint">
                      {project.year}
                      <span
                        aria-hidden
                        className="transition-transform group-open/row:rotate-90"
                      >
                        ›
                      </span>
                    </span>
                  </div>

                  <p className="mt-0.5 font-mono text-xs text-accent">
                    {project.tagline}
                  </p>

                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1 font-mono text-xs text-accent underline-offset-4 hover:underline",
                          link.primary &&
                            "rounded-md bg-accent-soft px-2.5 py-1 ring-1 ring-accent/25 hover:no-underline hover:ring-accent/50",
                        )}
                      >
                        {link.label}
                        <ArrowUpRight className="size-3" aria-hidden />
                      </a>
                    ))}
                  </div>
                </summary>

                <div className="px-5 pb-6 sm:px-6 sm:pb-7">
                  <ul className="space-y-2.5 border-t border-line pt-4">
                    {project.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="relative pl-5 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-accent/50"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-line px-2 py-1 font-mono text-[0.6875rem] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
