import type { Metadata } from "next";
import { Honors } from "@/components/honors";
import { Skills } from "@/components/skills";

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
