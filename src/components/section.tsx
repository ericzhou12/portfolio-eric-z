import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export function Section({
  id,
  index,
  title,
  intro,
  tight,
  children,
}: {
  id: string;
  index?: string;
  title: string;
  intro?: string;
  /** Pulls stacked sections closer together — for pages that read as one list. */
  tight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      // The leading section on a page carries no divider — only stacked ones do.
      className={cn(
        "border-t border-line first:border-t-0 first:pt-12 sm:first:pt-16",
        tight ? "py-12 sm:py-16" : "py-20 sm:py-28",
      )}
    >
      <Reveal>
        <header
          className={cn(
            "flex flex-col gap-3",
            tight ? "mb-8 sm:mb-10" : "mb-12 sm:mb-16",
          )}
        >
          <span className="label-caps">
            {index ? `${index} / ${title}` : title}
          </span>
          <h2
            id={`${id}-title`}
            className="heading-display text-4xl sm:text-5xl"
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
