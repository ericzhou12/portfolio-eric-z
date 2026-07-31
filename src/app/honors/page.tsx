import type { Metadata } from "next";
import { Honors } from "@/features/honors/honors";
import { Skills } from "@/features/honors/skills";

export const metadata: Metadata = {
  title: "Honors",
  description:
    "Awards, education, certifications, and the tools reached for most often.",
  alternates: { canonical: "/honors" },
};

export default function HonorsPage() {
  return (
    <>
      <Honors />
      <Skills />
    </>
  );
}
