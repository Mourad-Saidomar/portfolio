import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { Hero } from "@/components/site/hero";
import { PointerSurface } from "@/components/site/interactive";
import { PersonJsonLd } from "@/components/site/json-ld";
import { Marquee } from "@/components/site/marquee";
import { Reveal } from "@/components/site/motion";
import { PageTransition } from "@/components/site/page-transition";
import { ProjectCard } from "@/components/site/project-card";
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
  const [lead, ...rest] = featured;
  const skillNames = skills.flatMap((c) => c.skills.map((s) => s.name)).slice(0, 24);

  return (
    <PageTransition>
      {profile && <PersonJsonLd profile={profile} skills={skills} />}

      {profile ? (
        <Hero
          profile={profile}
          facts={[
            { label: "Projets publiés", value: projects.length },
            { label: "Expériences", value: timeline.filter((e) => e.kind === "experience").length },
            { label: "Langues", value: profile.languages.length },
            { label: "Domaines", value: skills.length },
          ]}
        />
      ) : (
        <section className="container-page section-y">
          <h1 className="font-display text-display">Mourad Saidomar</h1>
        </section>
      )}

      <Marquee items={skillNames} />

      {/* ─── Projets choisis ─────────────────────────────────── */}
      <section aria-labelledby="projets-title" className="container-page section-y">
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
          <div className="mt-14 grid gap-x-10 gap-y-20 md:mt-20 lg:grid-cols-12">
            <Reveal variant="clip" className="lg:col-span-12">
              <ProjectCard project={lead} index={0} size="large" />
            </Reveal>
            {rest.map((project, i) => (
              <Reveal key={project.id} variant="clip" delay={i * 0.12} className={i % 2 === 1 ? "lg:col-span-6 lg:mt-24" : "lg:col-span-6"}>
                <ProjectCard project={project} index={i + 1} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState title="Projets à venir">Les études de cas seront bientôt publiées.</EmptyState>
        )}
      </section>

      {/* ─── Profil ───────────────────────────────────────────── */}
      {profile && profile.differentiators.length > 0 && (
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
          <ol className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3">
            {profile.differentiators.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.1}>
                <PointerSurface className="spotlight group h-full overflow-hidden rounded-(--radius-lg) border border-line bg-surface p-8 transition-[border-color,translate] duration-500 ease-(--ease-out) hover:-translate-y-1 hover:border-accent/50 md:p-10">
                  <span className="font-display text-[4.5rem] leading-none text-coral/90 transition-colors duration-500 group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-10 font-display text-h3">{item.title}</h3>
                  <p className="mt-3 text-muted">{item.description}</p>
                </PointerSurface>
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
            {timeline.slice(0, 4).map((entry, i) => (
              <Reveal as="li" key={entry.id} delay={i * 0.06}>
                <Link
                  href="/parcours"
                  className="group relative isolate grid gap-2 overflow-hidden border-b border-line py-7 md:grid-cols-12 md:items-center md:gap-8"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-sunken transition-transform duration-500 ease-(--ease-out) group-hover:scale-y-100"
                  />
                  <span className="font-mono text-meta text-subtle transition-transform duration-500 ease-(--ease-out) group-hover:translate-x-3 md:col-span-3">
                    {formatPeriod(entry)}
                  </span>
                  <span className="transition-transform duration-500 ease-(--ease-out) group-hover:translate-x-3 md:col-span-8">
                    <span className="block font-display text-h3">{entry.title}</span>
                    <span className="block text-muted">{entry.organization}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="hidden size-6 -translate-x-3 justify-self-end opacity-0 transition-[opacity,translate] duration-500 ease-(--ease-out) group-hover:translate-x-0 group-hover:opacity-100 md:col-span-1 md:block"
                  />
                </Link>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      <ContactCta email={profile?.email} />
    </PageTransition>
  );
}
