import type { Metadata } from "next";
import { Recognition } from "@/features/background/recognition";
import { Skills } from "@/features/background/skills";

export const metadata: Metadata = {
  title: "Background",
  description:
    "Awards, education, certifications, and the tools reached for most often.",
  alternates: { canonical: "/background" },
};

export default function BackgroundPage() {
  return (
    <>
      <Recognition />
      <Skills />
    </>
  );
}
