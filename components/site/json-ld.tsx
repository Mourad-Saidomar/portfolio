import { env } from "@/lib/env";
import { stripHighlights } from "@/lib/highlight";
import type { Profile, SkillCategory } from "@/lib/types";

/** Données structurées schema.org/Person (SEO). */
export function PersonJsonLd({ profile, skills = [] }: { profile: Profile; skills?: SkillCategory[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    jobTitle: profile.headline,
    description: stripHighlights(profile.tagline),
    url: env.siteUrl,
    email: `mailto:${profile.email}`,
    image: profile.photo ? new URL(profile.photo.url, env.siteUrl).toString() : undefined,
    address: profile.location
      ? { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "FR" }
      : undefined,
    sameAs: [profile.socials.github, profile.socials.linkedin, profile.socials.website].filter(Boolean),
    knowsAbout: skills.flatMap((c) => c.skills.map((s) => s.name)).slice(0, 30),
    knowsLanguage: profile.languages.map((l) => l.name),
  };

  return (
    <script
      type="application/ld+json"
      // Échappement de « < » : empêche toute fermeture prématurée de la balise script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
