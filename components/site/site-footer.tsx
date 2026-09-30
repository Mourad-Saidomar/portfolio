import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { getProfile } from "@/lib/data/public";
import { NAV_LINKS } from "@/lib/navigation";

const FOOTER_LINKS = [{ href: "/", label: "Accueil" }, ...NAV_LINKS, { href: "/contact", label: "Contact" }];

export async function SiteFooter() {
  const profile = await getProfile();
  const name = profile?.fullName ?? "Mourad Saidomar";

  return (
    <footer className="border-t border-line">
      <div className="container-page grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="font-display text-h3">{name}</p>
          {profile && (
            <p className="mt-2 text-muted">
              {profile.headline}
              {profile.location ? ` — ${profile.location}` : ""}
            </p>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="link-underline mt-6 inline-flex items-center gap-2 text-lead">
              <Mail className="size-5 shrink-0 text-accent" aria-hidden />
              <span className="break-all">{profile.email}</span>
            </a>
          )}
        </div>

        <nav aria-label="Plan du site" className="md:col-span-3">
          <p className="font-mono text-meta uppercase text-subtle">Plan du site</p>
          <ul className="mt-4 space-y-1">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block py-1.5 text-muted hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="font-mono text-meta uppercase text-subtle">Ailleurs</p>
          <ul className="mt-4 space-y-1">
            {profile?.socials.github && (
              <li>
                <a
                  href={profile.socials.github}
                  className="inline-flex items-center gap-2 py-1.5 text-muted hover:text-ink"
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  <GithubIcon className="size-4" /> GitHub <ArrowUpRight className="size-3.5" aria-hidden />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              </li>
            )}
            {profile?.socials.linkedin && (
              <li>
                <a
                  href={profile.socials.linkedin}
                  className="inline-flex items-center gap-2 py-1.5 text-muted hover:text-ink"
                  rel="me noopener noreferrer"
                  target="_blank"
                >
                  <LinkedinIcon className="size-4" /> LinkedIn <ArrowUpRight className="size-3.5" aria-hidden />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              </li>
            )}
            {profile?.cvUrl && (
              <li>
                <a href="/cv" className="inline-flex items-center gap-2 py-1.5 text-muted hover:text-ink">
                  CV (PDF)
                </a>
              </li>
            )}
          </ul>
        </div>

        <p className="font-mono text-meta text-subtle md:col-span-12">
          © {name} — conçu et développé avec Next.js et Supabase.
        </p>
      </div>
    </footer>
  );
}
