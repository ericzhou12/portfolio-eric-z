import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { certifications, education, honors } from "@/lib/content";

export function Honors() {
  return (
    <Section
      id="honors"
      index="01"
      title="Honors"
      intro="Selected recognition, plus where I've studied."
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal>
          <ul className="divide-y divide-line border-y border-line">
            {honors.map((honor) => (
              <li
                key={honor.title}
                className="flex items-baseline justify-between gap-6 py-4"
              >
                <div>
                  <h3 className="text-sm font-medium text-fg">{honor.title}</h3>
                  <p className="mt-1 text-sm text-faint">{honor.detail}</p>
                </div>
                <span className="shrink-0 font-mono text-xs tabular-nums text-faint">
                  {honor.year}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <div className="space-y-10">
            <div>
              <h3 className="label-caps">Education</h3>
              <ul className="mt-4 space-y-5">
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
                    <p className="mt-0.5 font-mono text-xs text-faint">
                      {school.location}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="label-caps">Certifications</h3>
              <ul className="mt-4 space-y-3">
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
