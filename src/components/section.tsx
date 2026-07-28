import { Reveal } from "@/components/reveal";

export function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-t border-line py-20 sm:py-28"
    >
      <Reveal>
        <header className="mb-12 flex flex-col gap-3 sm:mb-16">
          <span className="label-caps">
            {index} / {title}
          </span>
          <h2
            id={`${id}-title`}
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {title}
          </h2>
          {intro ? (
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              {intro}
            </p>
          ) : null}
        </header>
      </Reveal>
      {children}
    </section>
  );
}
