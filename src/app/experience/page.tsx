import type { Metadata } from "next";
import { Experience } from "@/components/experience";
import { ExperienceView } from "@/components/experience-view";
import { Projects } from "@/components/projects";

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
