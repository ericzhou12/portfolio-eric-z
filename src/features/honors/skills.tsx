import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { skills } from "@/lib/content";

export function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      title="Stuff I Use"
      intro="tools, languages, frameworks i build with; find what's useful to you"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {skills.map((group, index) => (
          <Reveal key={group.group} delay={index * 50}>
            <div>
              <h3 className="label-caps border-b border-line pb-3">
                {group.group}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line bg-surface px-2.5 py-1.5 font-mono text-xs text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
