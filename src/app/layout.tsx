import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { profile } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: `${profile.name} — Software Engineer`,
    template: `%s · ${profile.name}`,
  },
  description:
    "Eric Zhou — CS & Math at Northwestern. SDE intern at Tyler Technologies, Simons Research Fellow working on reinforcement learning for DAG-based BFT consensus.",
  keywords: [
    "Eric Zhou",
    "software engineer",
    "Northwestern University",
    "distributed systems",
    "AWS",
    "reinforcement learning",
    "Tyler Technologies",
    "Simons Research Fellow",
  ],
  authors: [{ name: profile.name, url: profile.site }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: `${profile.name} — Software Engineer`,
    description:
      "CS & Math at Northwestern. Serverless platforms on AWS, and RL for Byzantine fault-tolerant consensus.",
    url: profile.site,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Software Engineer`,
    description:
      "CS & Math at Northwestern. Serverless platforms on AWS, and RL for Byzantine fault-tolerant consensus.",
  },
  robots: { index: true, follow: true },
};

// Structured data so recruiter-facing search surfaces the right facts.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  email: `mailto:${profile.email}`,
  url: profile.site,
  jobTitle: "Software Development Engineer Intern",
  worksFor: { "@type": "Organization", name: "Tyler Technologies" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Northwestern University" },
    { "@type": "HighSchool", name: "Troy High School" },
  ],
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: [
    "Distributed Systems",
    "Byzantine Fault Tolerance",
    "Reinforcement Learning",
    "AWS Cloud Infrastructure",
    "TypeScript",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${mono.variable} font-sans bg-bg text-fg`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
