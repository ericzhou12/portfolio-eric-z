import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { experience } from "@/lib/content";

export function Experience() {
  return (
    <Section
      id="experience"
      index="01"
      title="Experience"
      intro="Cloud infrastructure, distributed systems research, and the occasional smart contract audit."
    >
      {/* The current role gets the full width; the rest pair up on wide screens. */}
      <ol className="grid gap-4 xl:grid-cols-2">
        {experience.map((job, index) => (
          <li
            key={`${job.org}-${job.role}`}
            className={index === 0 ? "xl:col-span-2" : undefined}
          >
            <Reveal delay={index * 60} className="h-full">
              <article className="group h-full rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent/30 sm:p-8">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {job.role}
                    <span className="text-faint"> · </span>
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
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-faint">
                    {job.period}
                  </span>
                </div>

                <p className="mt-1.5 font-mono text-xs text-faint">
                  {job.kind} · {job.location}
                </p>

                <p className="mt-4 text-base leading-relaxed text-muted">
                  {job.summary}
                </p>

                {job.metrics ? (
                  <dl className="mt-6 grid grid-cols-1 gap-4 border-y border-line py-5 sm:grid-cols-3">
                    {job.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="sr-only">{metric.label}</dt>
                        <dd>
                          <span className="block text-2xl font-semibold tabular-nums tracking-tight text-accent">
                            {metric.value}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-faint">
                            {metric.label}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <details className="group/details mt-5">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
                    <span className="transition-transform group-open/details:rotate-90">
                      ›
                    </span>
                    Details
                  </summary>
                  <ul className="mt-4 space-y-3">
                    {job.points.map((point) => (
                      <li
                        key={point}
                        className="relative pl-5 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-accent/50"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </details>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {job.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-line px-2 py-1 font-mono text-[0.6875rem] text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {job.links ? (
                  <div className="mt-5 flex flex-wrap gap-4">
                    {job.links.map((link) => (
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
                ) : null}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
