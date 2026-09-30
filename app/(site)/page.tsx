import { ArrowRight, Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { PersonJsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/motion";
import { PageTransition } from "@/components/site/page-transition";
import { ProjectCard } from "@/components/site/project-card";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile, getProjects, getSkillCategories, getTimeline } from "@/lib/data/public";
import { formatPeriod } from "@/lib/format";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [profile, projects, timeline, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getTimeline(),
    getSkillCategories(),
  ]);

  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);
  const experiences = timeline.filter((e) => e.kind === "experience").length;
  const [lead, ...rest] = featured;

  return (
    <PageTransition>
      {profile && <PersonJsonLd profile={profile} skills={skills} />}

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="hero-title" className="container-page pt-10 pb-16 sm:pt-16 md:pb-24 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-meta text-subtle">
              {profile?.location && <span>{profile.location}</span>}
              {profile?.availability && (
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-ink">
                  <span className="relative flex size-2" aria-hidden>
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  {profile.availability}
                </span>
              )}
            </div>

            <h1 id="hero-title" className="mt-8 font-display text-display">
              {profile?.fullName ?? "Mourad Saidomar"}
              <span className="mt-3 block text-h2 text-accent">{profile?.headline ?? "Développeur web"}</span>
            </h1>

            {profile?.tagline && <p className="mt-8 max-w-[34ch] text-h3 text-ink">{profile.tagline}</p>}
            {profile?.intro && <p className="mt-5 max-w-[58ch] text-lead text-muted">{profile.intro}</p>}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/projets" icon={<ArrowRight className="size-4" />}>
                Voir les projets
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Me contacter
              </ButtonLink>
              {profile?.cvUrl && (
                <ButtonAnchor href="/cv" variant="ghost" icon={<Download className="size-4" />} iconPosition="start">
                  CV (PDF)
                </ButtonAnchor>
              )}
            </div>
          </div>

          {profile?.photo && (
            <figure className="relative mx-auto w-full max-w-sm self-end lg:col-span-4 lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-(--radius-lg) bg-sunken">
                <Image
                  src={profile.photo.url}
                  alt={profile.photo.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 384px, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 flex justify-between font-mono text-meta text-subtle">
                <span>{profile.fullName}</span>
                <span>{profile.location}</span>
              </figcaption>
            </figure>
          )}
        </div>

        {profile && (
          <dl className="mt-16 grid grid-cols-2 border-t border-line md:mt-24 md:grid-cols-4">
            {[
              { label: "Projets publiés", value: String(projects.length).padStart(2, "0") },
              { label: "Expériences", value: String(experiences).padStart(2, "0") },
              { label: "Langues", value: String(profile.languages.length).padStart(2, "0") },
              { label: "Domaines", value: String(skills.length).padStart(2, "0") },
            ].map((fact) => (
              <div key={fact.label} className="border-b border-line py-6 pr-4 md:border-b-0">
                <dt className="font-mono text-meta text-subtle">{fact.label}</dt>
                <dd className="mt-2 font-display text-h2">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* ─── Projets choisis ─────────────────────────────────── */}
      <section aria-labelledby="projets-title" className="container-page section-y border-t border-line">
        <SectionHeading
          index="01"
          eyebrow="Projets choisis"
          id="projets-title"
          title="Des projets concrets, de la conception au déploiement."
          action={
            projects.length > featured.length ? (
              <Link href="/projets" className="link-underline inline-flex items-center gap-2 font-medium">
                Tous les projets <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : undefined
          }
        />
        {lead ? (
          <div className="mt-14 grid gap-x-8 gap-y-16 md:mt-20 lg:grid-cols-12">
            <Reveal className="lg:col-span-12">
              <ProjectCard project={lead} index={0} size="large" />
            </Reveal>
            {rest.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08} className="lg:col-span-6">
                <ProjectCard project={project} index={i + 1} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState title="Projets à venir">Les études de cas seront bientôt publiées.</EmptyState>
        )}
      </section>

      {/* ─── Profil ───────────────────────────────────────────── */}
      {profile && (
        <section aria-labelledby="profil-title" className="container-page section-y border-t border-line">
          <SectionHeading
            index="02"
            eyebrow="En bref"
            id="profil-title"
            title="Ce qui me distingue."
            lead={profile.bio.split(/\n{2,}/)[0]}
            action={
              <Link href="/a-propos" className="link-underline inline-flex items-center gap-2 font-medium">
                En savoir plus <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-(--radius-lg) border border-line bg-line md:mt-20 md:grid-cols-3">
            {profile.differentiators.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.08} className="bg-bg p-8 md:p-10">
                <span className="font-mono text-meta text-coral">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-h3">{item.title}</h3>
                <p className="mt-3 text-muted">{item.description}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {/* ─── Parcours récent ─────────────────────────────────── */}
      {timeline.length > 0 && (
        <section aria-labelledby="parcours-title" className="container-page section-y border-t border-line">
          <SectionHeading
            index="03"
            eyebrow="Parcours"
            id="parcours-title"
            title="Du réseau au code."
            action={
              <Link href="/parcours" className="link-underline inline-flex items-center gap-2 font-medium">
                Tout le parcours <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <ol className="mt-14 border-t border-line md:mt-20">
            {timeline.slice(0, 4).map((entry) => (
              <li key={entry.id} className="grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-8">
                <p className="font-mono text-meta text-subtle md:col-span-3 md:pt-1.5">{formatPeriod(entry)}</p>
                <div className="md:col-span-9">
                  <h3 className="text-lead font-medium">{entry.title}</h3>
                  <p className="text-muted">{entry.organization}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <ContactCta email={profile?.email} />
    </PageTransition>
  );
}
