import type { Metadata } from "next";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Engineering and research roles, plus the projects built end to end alongside them.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <Experience />
      <Projects />
    </>
  );
}
