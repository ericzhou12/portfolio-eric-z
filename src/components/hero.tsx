import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { ConsensusViz } from "@/components/consensus-viz";
import { CopyEmail } from "@/components/copy-email";
import { Reveal } from "@/components/reveal";
import { facts, profile } from "@/lib/content";

export function Hero() {
  return (
    <section id="top" className="pb-20 pt-12 sm:pb-28 sm:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Reveal>
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span className="label-caps">{profile.status}</span>
          </div>

          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {profile.name}
          </h1>

          <p className="mt-4 text-xl text-muted sm:text-2xl">
            {profile.headline}
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            {profile.blurb}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fg px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              <Download className="size-4" aria-hidden />
              Résumé
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-accent/5"
            >
              Get in touch
            </a>
          </div>

          <CopyEmail className="mt-6" />

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
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
          <ConsensusViz />
        </Reveal>
      </div>

      <Link
        href="/work"
        className="group mt-16 inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-fg no-print"
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
