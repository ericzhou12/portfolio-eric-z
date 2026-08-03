import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { experience, type Job } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Logo stand-in: leading capitals of the org name, capped at two. */
const initialsOf = (org: string) =>
  (org.match(/[A-Z]/g) ?? [org.slice(0, 1).toUpperCase()]).slice(0, 2).join("");

function Logo({ job }: { job: Job }) {
  return (
    <span
      aria-hidden
      className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-bg"
    >
      {job.logo ? (
        <Image
          src={job.logo}
          alt=""
          width={44}
          height={44}
          // Solid-background marks bleed to the tile edge; transparent ones inset.
          className={
            job.logoFill ? "size-full object-cover" : "size-7 object-contain"
          }
        />
      ) : (
        <span className="font-mono text-xs font-semibold text-muted">
          {initialsOf(job.org)}
        </span>
      )}
    </span>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      index="01"
      title="Experience"
      intro="Cloud infrastructure, distributed systems research, and the occasional smart contract audit."
      tight
    >
      <ol className="overflow-hidden rounded-xl border border-line bg-surface">
        {experience.map((job, index) => (
          <li key={job.id} className="border-t border-line first:border-t-0">
            <Reveal delay={index * 60}>
              {/* The whole row is the summary, so a click anywhere expands it;
                  nested links keep their own activation and don't toggle. */}
              <details className="group/row">
                <summary className="flex cursor-pointer list-none gap-4 p-5 transition-colors hover:bg-accent-soft/40 sm:gap-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <Logo job={job} />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-x-6 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-base font-semibold tracking-tight">
                        {job.role}
                      </h3>
                      <span className="flex shrink-0 items-baseline gap-2 font-mono text-xs text-faint">
                        {job.period}
                        <span
                          aria-hidden
                          className="transition-transform group-open/row:rotate-90"
                        >
                          ›
                        </span>
                      </span>
                    </div>

                    <p className="mt-0.5 font-mono text-xs">
                      {job.orgUrl ? (
                        <a
                          href={job.orgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline-offset-4 hover:underline"
                        >
                          {job.org}
                        </a>
                      ) : (
                        <span className="text-accent">{job.org}</span>
                      )}
                      <span className="text-faint">
                        {" · "}
                        {job.kind} · {job.location}
                      </span>
                    </p>

                    <p className="mt-2.5 text-sm leading-relaxed text-muted">
                      {job.summary}
                    </p>

                    {job.links ? (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {job.links.map((link) => (
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
                            {link.primary ? (
                              <span className="mr-0.5 text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                                Paper
                              </span>
                            ) : null}
                            {link.label}
                            <ArrowUpRight className="size-3" aria-hidden />
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </summary>

                {/* Indented to the text column so the expansion lines up. */}
                <div className="px-5 pb-6 pl-20 sm:px-6 sm:pb-7 sm:pl-[5.75rem]">
                  <ul className="space-y-2.5 border-t border-line pt-4">
                    {job.points.map((point) => (
                      <li
                        key={point}
                        className="relative pl-5 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-accent/50"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-line px-2 py-1 font-mono text-[0.6875rem] text-muted"
                      >
                        {tech}
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
