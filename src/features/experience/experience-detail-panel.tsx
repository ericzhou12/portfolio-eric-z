"use client";

import { ArrowUpRight, X } from "lucide-react";
import type { GraphEntry } from "@/features/experience/graph";

/**
 * Docked detail for a selected graph node. Mirrors the card markup in
 * experience.tsx / projects.tsx so nothing is lost versus the list view.
 */
export function ExperienceDetailPanel({
  entry,
  onClose,
}: {
  entry: GraphEntry;
  onClose: () => void;
}) {
  const job = entry.job;
  const project = entry.project;
  const bullets = job ? job.points : (project?.highlights ?? []);
  const links = job?.links ?? project?.links ?? [];

  return (
    <div
      role="region"
      aria-label={`${entry.title} detail`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line p-6">
        <div className="min-w-0">
          <span className="label-caps">
            {entry.band === "work" ? "Experience" : "Project"}
          </span>
          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight">
            {entry.title}
          </h3>
          <p className="mt-1.5 font-mono text-xs text-accent">
            {job?.orgUrl ? (
              <a
                href={job.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {entry.subtitle}
              </a>
            ) : (
              entry.subtitle
            )}
          </p>
          <p className="mt-1.5 font-mono text-xs text-faint">
            {job ? `${job.kind} · ${job.location} · ` : null}
            {entry.period}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail"
          className="shrink-0 rounded-md border border-line p-1.5 text-faint transition-colors hover:border-accent/40 hover:text-fg"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm leading-relaxed text-muted">{entry.summary}</p>

        {job?.metrics ? (
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

        <ul className="mt-6 space-y-3">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="relative pl-5 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-accent/50"
            >
              {bullet}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {entry.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-md border border-line px-2 py-1 font-mono text-[0.6875rem] text-muted"
            >
              {chip}
            </span>
          ))}
        </div>

        {links.length ? (
          <div className="mt-6 flex flex-wrap gap-4 border-t border-line pt-5">
            {links.map((link) => (
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
      </div>
    </div>
  );
}
