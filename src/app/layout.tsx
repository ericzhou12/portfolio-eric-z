import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/command-palette";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SocialRail } from "@/components/social-rail";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/content";
import { cn, shell } from "@/lib/utils";

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
    default: `${profile.name}`,
    template: `%s · ${profile.name}`,
  },
  description:
    "Eric Zhou Website",
  keywords: [
    "Eric Zhou",
    "software engineer",
    "machine learning",
    "AI",
    "human AI interaction",
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
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
          >
            Skip to content
          </a>

          {/* Column layout lets a page claim exactly one viewport height. */}
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <CommandPalette />
            <ThemeToggle />
            <SocialRail />

            <main id="content" className={cn(shell, "flex flex-1 flex-col")}>
              {children}
              <SiteFooter />
            </main>
          </div>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
