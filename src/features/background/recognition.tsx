import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { certifications, education, honors } from "@/lib/content";

export function Recognition() {
  return (
    <Section
      id="recognition"
      index="01"
      title="Recognition"
      intro="awards and education, the short version"
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal>
          <ul className="divide-y divide-line border-y border-line">
            {honors.map((honor) => (
              <li
                key={honor.title}
                className="group grid grid-cols-[4rem_1fr] items-baseline gap-5 py-5"
              >
                <span className="font-mono text-xs tabular-nums text-faint">
                  {honor.year}
                </span>
                <div>
                  <h3 className="text-[0.9375rem] font-medium text-fg transition-colors group-hover:text-accent">
                    {honor.title}
                  </h3>
                  <p className="mt-1 text-sm text-faint">{honor.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <div className="space-y-10 lg:border-l lg:border-line lg:pl-10">
            <div>
              <h3 className="label-caps">Education</h3>
              <ul className="mt-5 space-y-6">
                {education.map((school) => (
                  <li key={school.school}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="text-sm font-medium text-fg">
                        {school.school}
                      </h4>
                      <span className="shrink-0 font-mono text-xs text-faint">
                        {school.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {school.detail}
                    </p>
                    <p className="mt-1 font-mono text-xs text-faint">
                      {school.location}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="label-caps">Certifications + Misc</h3>
              <ul className="mt-5 space-y-4">
                {certifications.map((cert) => (
                  <li
                    key={cert.title}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <div>
                      <span className="text-sm text-fg">{cert.title}</span>
                      <span className="block text-xs text-faint">
                        {cert.org}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-faint">
                      {cert.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
