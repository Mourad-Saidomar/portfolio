import { ArrowUpRight, Download, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { MaskWords } from "@/components/site/mask-words";
import { PageTransition } from "@/components/site/page-transition";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { getProfile } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter Mourad Saidomar : formulaire, e-mail, LinkedIn, GitHub et CV à télécharger.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await getProfile();

  const channels = [
    profile?.email && {
      href: `mailto:${profile.email}`,
      label: "E-mail",
      value: profile.email,
      icon: <Mail className="size-5" aria-hidden />,
    },
    profile?.phone && {
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
      label: "Téléphone",
      value: profile.phone,
      icon: <Phone className="size-5" aria-hidden />,
    },
    profile?.socials.linkedin && {
      href: profile.socials.linkedin,
      label: "LinkedIn",
      value: "Voir le profil",
      icon: <LinkedinIcon className="size-5" />,
      external: true,
    },
    profile?.socials.github && {
      href: profile.socials.github,
      label: "GitHub",
      value: profile.socials.github.replace(/^https?:\/\/(www\.)?/, ""),
      icon: <GithubIcon className="size-5" />,
      external: true,
    },
    profile?.cvUrl && {
      href: "/cv",
      label: "CV",
      value: "Télécharger (PDF)",
      icon: <Download className="size-5" aria-hidden />,
    },
  ].filter(Boolean) as { href: string; label: string; value: string; icon: React.ReactNode; external?: boolean }[];

  return (
    <PageTransition>
      <section className="container-page pt-14 pb-24 md:pt-24 md:pb-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 font-mono text-meta uppercase text-subtle">
              <span aria-hidden className="h-px w-8 bg-line" />
              Contact
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.75rem,1.4rem+5.4vw,6.25rem)] leading-[0.95] tracking-[-0.025em]">
              <MaskWords text="Parlons de votre projet." delay={100} />
            </h1>
            <p className="mt-6 max-w-[44ch] text-lead text-muted">
              Une offre de stage, une mission ou simplement une question : écrivez-moi, je réponds à chaque message.
            </p>
            {profile?.location && (
              <p className="mt-6 inline-flex items-center gap-2 text-muted">
                <MapPin className="size-4" aria-hidden /> {profile.location}
              </p>
            )}

            {channels.length > 0 && (
              <ul className="mt-12 border-t border-line">
                {channels.map((channel) => (
                  <li key={channel.label} className="border-b border-line">
                    <a
                      href={channel.href}
                      {...(channel.external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}
                      className="group flex min-h-16 items-center gap-4 py-4"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken text-accent">
                        {channel.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-meta text-subtle">{channel.label}</span>
                        <span className="block truncate group-hover:text-accent">{channel.value}</span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-subtle transition-transform duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                      {channel.external && <span className="sr-only">(nouvel onglet)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-(--radius-lg) border border-line bg-surface p-6 sm:p-8 md:p-10">
              <h2 className="font-display text-h3">Envoyer un message</h2>
              <div className="mt-6">
                <ContactForm email={profile?.email ?? null} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
