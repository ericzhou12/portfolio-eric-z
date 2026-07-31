import type { Metadata } from "next";
import { Experience } from "@/features/experience/experience";
import { ExperienceView } from "@/features/experience/experience-view";
import { Projects } from "@/features/experience/projects";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Engineering and research roles, plus the projects built end to end alongside them.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <ExperienceView>
      <Experience />
      <Projects />
    </ExperienceView>
  );
}
