import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { skills } from "@/lib/content";

export function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      title="Toolkit"
      intro="languages, frameworks, and infrastructure i reach for"
      tight
    >
      <Reveal>
        <div className="divide-y divide-line border-y border-line">
          {skills.map((group) => (
            <div
              key={group.group}
              className="grid gap-3 py-5 sm:grid-cols-[12rem_1fr] sm:gap-8"
            >
              <h3 className="label-caps pt-0.5">{group.group}</h3>
              <ul className="flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[0.8125rem] leading-relaxed text-muted">
                {group.items.map((item, index) => (
                  <li key={item} className="flex items-center gap-2">
                    {index > 0 ? (
                      <span aria-hidden className="text-line">
                        ·
                      </span>
                    ) : null}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
