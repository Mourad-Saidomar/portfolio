import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { PointerSurface } from "@/components/site/interactive";
import { PersonJsonLd } from "@/components/site/json-ld";
import { MaskWords } from "@/components/site/mask-words";
import { Reveal } from "@/components/site/motion";
import { PageTransition } from "@/components/site/page-transition";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile, getSkillCategories } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "À propos",
  description: "Présentation, valeurs et ce qui distingue Mourad Saidomar, développeur web & web mobile à Mayotte.",
  path: "/a-propos",
});

export default async function AboutPage() {
  const [profile, skills] = await Promise.all([getProfile(), getSkillCategories()]);

  if (!profile) {
    return (
      <PageTransition>
        <div className="container-page section-y">
          <h1 className="sr-only">À propos</h1>
          <EmptyState title="Profil en cours de rédaction" />
        </div>
      </PageTransition>
    );
  }

  const paragraphs = profile.bio.split(/\n{2,}/).filter(Boolean);

  return (
    <PageTransition>
      <PersonJsonLd profile={profile} skills={skills} />

      <section className="container-page pt-14 pb-16 md:pt-24 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="enter flex items-center gap-3 font-mono text-meta uppercase text-subtle">
              <span aria-hidden className="draw-line h-px w-8 bg-accent" style={{ "--d": "150ms" } as CSSProperties} />À propos
            </p>
            <h1 className="mt-6 font-display uppercase text-[clamp(2.75rem,1.4rem+5.4vw,6.25rem)] leading-[0.95]">
              <MaskWords text={`${profile.fullName},`} delay={100} />{" "}
              <span className="text-accent">
                <MaskWords text={`${profile.headline.toLowerCase()}.`} delay={260} />
              </span>
            </h1>
            <div className="enter-soft mt-10 max-w-[62ch] space-y-5 text-lead" style={{ "--d": "400ms" } as CSSProperties}>
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-ink" : "text-muted"}>
                  {p}
                </p>
              ))}
            </div>
            <div className="enter mt-10 flex flex-wrap gap-3" style={{ "--d": "550ms" } as CSSProperties}>
              <ButtonLink href="/projets" icon={<ArrowRight className="size-4" />}>
                Voir mes projets
              </ButtonLink>
              <ButtonLink href="/parcours" variant="secondary">
                Mon parcours
              </ButtonLink>
            </div>
          </div>

          {profile.photo && (
            <figure className="lg:col-span-4 lg:col-start-9">
              <div
                className="curtain relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-(--radius-lg) bg-sunken lg:max-w-none"
                style={{ "--d": "250ms" } as CSSProperties}
              >
                <Image
                  src={profile.photo.url}
                  alt={profile.photo.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 30vw, 384px"
                  className="object-cover object-top"
                />
              </div>
              {profile.location && (
                <figcaption className="mt-3 text-center font-mono text-meta text-subtle lg:text-left">
                  {profile.location}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </section>

      {profile.values.length > 0 && (
        <section aria-labelledby="valeurs" className="container-page section-y border-t border-line">
          <SectionHeading index="01" eyebrow="Valeurs" id="valeurs" title="Ce qui guide mon travail." />
          <ol className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
            {profile.values.map((value, i) => (
              <Reveal as="li" key={value.title} delay={i * 0.1} className="group border-t border-ink pt-6">
                <span className="font-display uppercase text-[4rem] leading-none text-subtle transition-colors duration-500 group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display uppercase text-h3">{value.title}</h3>
                <p className="mt-3 text-muted">{value.description}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {profile.differentiators.length > 0 && (
        <section aria-labelledby="difference" className="container-page section-y border-t border-line">
          <SectionHeading index="02" eyebrow="Différence" id="difference" title="Ce qui me distingue." />
          <ol className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3">
            {profile.differentiators.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.1}>
                <PointerSurface className="spotlight h-full overflow-hidden rounded-(--radius-lg) border border-line bg-surface p-8 transition-[border-color,translate] duration-500 ease-(--ease-out) hover:-translate-y-1 hover:border-accent/50 md:p-10">
                  <h3 className="font-display uppercase text-h3">{item.title}</h3>
                  <p className="mt-3 text-muted">{item.description}</p>
                </PointerSurface>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {(profile.languages.length > 0 || profile.interests.length > 0) && (
        <section aria-labelledby="plus" className="container-page section-y border-t border-line">
          <SectionHeading index="03" eyebrow="En dehors du code" id="plus" title="Langues et centres d'intérêt." />
          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-8">
            {profile.languages.length > 0 && (
              <div>
                <h3 className="font-mono text-meta uppercase text-subtle">Langues</h3>
                <dl className="mt-4 border-t border-line">
                  {profile.languages.map((l) => (
                    <div key={l.name} className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-line py-4">
                      <dt className="font-medium">{l.name}</dt>
                      <dd className="text-muted">{l.level}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {profile.interests.length > 0 && (
              <div>
                <h3 className="font-mono text-meta uppercase text-subtle">Centres d&apos;intérêt</h3>
                <ul className="mt-4 border-t border-line">
                  {profile.interests.map((interest) => (
                    <li key={interest} className="border-b border-line py-4">
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <ContactCta email={profile.email} />
    </PageTransition>
  );
}
