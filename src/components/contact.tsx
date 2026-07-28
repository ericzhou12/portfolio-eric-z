import { Download, Github, Linkedin, Mail } from "lucide-react";
import { CopyEmail } from "@/components/copy-email";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { profile } from "@/lib/content";

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: "GitHub", value: "ericzhou12", href: profile.github, icon: Github },
  { label: "LinkedIn", value: "in/erichyzhou", href: profile.linkedin, icon: Linkedin },
  { label: "Résumé", value: "PDF, one page", href: profile.resume, icon: Download },
];

export function Contact() {
  return (
    <Section
      id="contact"
      index="05"
      title="Contact"
      intro="Recruiting, research, or just want to talk distributed systems — my inbox is open."
    >
      <Reveal>
        <div className="grid gap-8 sm:grid-cols-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent/30"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-accent">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="label-caps block">{link.label}</span>
                  <span className="mt-1 block truncate text-sm text-fg">
                    {link.value}
                  </span>
                </span>
              </a>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
          <CopyEmail />
          <span className="font-mono text-sm text-muted">{profile.phone}</span>
          <span className="font-mono text-sm text-faint">
            {profile.location}
          </span>
        </div>
      </Reveal>
    </Section>
  );
}
