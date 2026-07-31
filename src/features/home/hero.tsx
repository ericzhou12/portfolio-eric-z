import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import { CopyEmail } from "@/features/home/copy-email";
import { ExperiencePreview } from "@/features/experience/experience-preview";
import { Reveal } from "@/components/reveal";
import { StatusLine } from "@/features/music/status-line";
import { facts, profile } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 flex flex-1 flex-col justify-center py-10 lg:py-6"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Reveal>
          <StatusLine />

          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {profile.name}
          </h1>

          <p className="mt-3 text-xl text-muted sm:text-2xl">
            {profile.headline}
          </p>

          {profile.blurb ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              {profile.blurb}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              <Download className="size-4" aria-hidden />
              résumé
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <Github className="size-4" aria-hidden />
              github
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <Linkedin className="size-4" aria-hidden />
              linkedin
            </a>
          </div>

          <CopyEmail className="mt-5" />

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label-caps">{fact.label}</dt>
                <dd className="mt-1.5 text-sm leading-snug text-fg">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120}>
          <ExperiencePreview href="/experience" />
        </Reveal>
      </div>

      <Link
        href="/experience"
        className="group mt-8 inline-flex items-center gap-2 self-start text-sm text-faint transition-colors hover:text-fg no-print lg:mt-6"
      >
        See the work
        <ArrowRight
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </Link>
    </section>
  );
}
