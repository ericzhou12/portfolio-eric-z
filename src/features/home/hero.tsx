import Link from "next/link";
import { ArrowRight, FileText, Github, Linkedin, Mail } from "lucide-react";
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

          <h1 className="heading-display mt-5 text-6xl leading-[0.95] sm:text-7xl">
            {profile.name}
          </h1>

          <p className="mt-4 text-lg text-muted sm:text-xl">
            {profile.headline}
          </p>

          {profile.blurb ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              {profile.blurb}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download résumé (PDF)"
              title="Résumé"
              className="inline-flex h-11 items-center justify-center rounded-full px-5 border border-line text-fg transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <FileText className="size-[18px]" aria-hidden />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="inline-flex h-11 items-center justify-center rounded-full px-5 border border-line text-fg transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <Github className="size-[18px]" aria-hidden />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
              className="inline-flex h-11 items-center justify-center rounded-full px-5 border border-line text-fg transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <Linkedin className="size-[18px]" aria-hidden />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label={`Email ${profile.email}`}
              title="Email"
              className="inline-flex h-11 items-center justify-center rounded-full px-5 border border-line text-fg transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <Mail className="size-[18px]" aria-hidden />
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
