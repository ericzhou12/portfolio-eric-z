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
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal
            key={project.title}
            delay={index * 60}
            className={cn("h-full", index === 0 && "md:col-span-2 xl:col-span-1")}
          >
            <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent/30 sm:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">
                  {project.title}
                </h3>
                <span className="shrink-0 font-mono text-xs text-faint">
                  {project.year}
                </span>
              </div>

              <p className="mt-1.5 font-mono text-xs text-accent">
                {project.tagline}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              <ul className="mt-5 space-y-2.5">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="relative pl-5 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-accent/50"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-line px-2 py-1 font-mono text-[0.6875rem] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* mt-auto pins links to the card base so a row reads evenly. */}
              <div className="mt-auto pt-6">
                <div className="flex flex-wrap gap-4 border-t border-line pt-5">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-accent underline-offset-4 hover:underline"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3" aria-hidden />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
