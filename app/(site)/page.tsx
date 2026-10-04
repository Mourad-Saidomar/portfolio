import { ArrowRight, BriefcaseBusiness, FolderKanban, GraduationCap, Languages } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { type CSSProperties, Suspense } from "react";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { FeaturedProject } from "@/components/site/featured-project";
import { HERO_CARD_DELAY, Hero } from "@/components/site/hero";
import { Facts, Philosophy, Testimonials, TimelineBrief } from "@/components/site/home-about";
import { PersonJsonLd } from "@/components/site/json-ld";
import { Marquee } from "@/components/site/marquee";
import { Reveal } from "@/components/site/motion";
import { PageTransition } from "@/components/site/page-transition";
import { ProjectTile } from "@/components/site/project-card";
import {
  FeaturedProjectSkeleton,
  HeroSkeleton,
  HomeAboutSkeleton,
  MarqueeSkeleton,
  ProjectTilesSkeleton,
} from "@/components/site/skeletons";
import { SectionHeading } from "@/components/ui/section-heading";
import { SkeletonText } from "@/components/ui/skeleton";
import {
  getProfile,
  getProjects,
  getSkillCategories,
  getTestimonials,
  getTimeline,
} from "@/lib/data/public";
import type { ProjectSummary } from "@/lib/types";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Projets mis en avant (à défaut, les premiers) ; le premier est le projet phare. */
function selection(projects: ProjectSummary[]) {
  return (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 3);
}

/*
 * Chaque bloc de données est rendu dans sa propre frontière <Suspense>, avec un squelette
 * aux dimensions du contenu réel. Les lectures sont mises en cache (« use cache ») et
 * dédupliquées : les squelettes ne s'affichent que si les données doivent vraiment être chargées.
 */
export default function HomePage() {
  return (
    <PageTransition>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<FeaturedProjectSkeleton />}>
        <FeaturedSection />
      </Suspense>

      <Suspense fallback={<MarqueeSkeleton />}>
        <SkillsMarquee />
      </Suspense>

      {/* ─── Projets ──────────────────────────────────────────── */}
      <section id="projets" aria-labelledby="projets-title" className="container-page section-y">
        <Suspense
          fallback={
            <>
              <SectionHeading index="01" eyebrow="Projets" id="projets-title" title="Des projets concrets, de la conception au déploiement." />
              <ProjectTilesSkeleton />
            </>
          }
        >
          <ProjectsSection />
        </Suspense>
      </section>

      {/* ─── À propos ─────────────────────────────────────────── */}
      <section id="a-propos" aria-labelledby="apropos-title" className="container-page section-y border-t border-line">
        <Suspense
          fallback={
            <>
              <SectionHeading
                index="02"
                eyebrow="À propos"
                id="apropos-title"
                title="Du réseau au code."
                lead={<SkeletonText lines={3} />}
                action={<AboutLink />}
              />
              <HomeAboutSkeleton />
            </>
          }
        >
          <AboutSection />
        </Suspense>
      </section>

      <Suspense fallback={<ContactCta />}>
        <ContactSection />
      </Suspense>
    </PageTransition>
  );
}

async function HeroSection() {
  const [profile, skills] = await Promise.all([getProfile(), getSkillCategories()]);
  if (!profile) {
    return (
      <section className="container-page section-y">
        <h1 className="font-display text-display uppercase">Mourad Saidomar</h1>
      </section>
    );
  }
  return (
    <>
      <PersonJsonLd profile={profile} skills={skills} />
      <Hero profile={profile} />
    </>
  );
}

async function FeaturedSection() {
  const flagship = selection(await getProjects())[0];
  if (!flagship) return null;
  return (
    <div className="container-page pt-6 pb-10 lg:pb-14">
      {/* Dernière étape de la séquence d'entrée du hero. */}
      <div className="hero-in" style={{ "--d": `${HERO_CARD_DELAY}ms` } as CSSProperties}>
        <FeaturedProject project={flagship} />
      </div>
    </div>
  );
}

async function SkillsMarquee() {
  const skills = await getSkillCategories();
  return <Marquee items={skills.flatMap((c) => c.skills.map((s) => s.name)).slice(0, 24)} />;
}

async function ProjectsSection() {
  const projects = await getProjects();
  const chosen = selection(projects);
  const flagshipId = chosen[0]?.id;

  return (
    <div className="data-in">
      <SectionHeading
        index="01"
        eyebrow="Projets"
        id="projets-title"
        title="Des projets concrets, de la conception au déploiement."
        action={
          projects.length > chosen.length ? (
            <Link href="/projets" className="link-underline inline-flex items-center gap-2 font-medium">
              Tous les projets ({projects.length}) <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : undefined
        }
      />
      {chosen.length > 0 ? (
        // Grille asymétrique : premier projet en grande tuile sur deux rangées, les suivants empilés à côté.
        <ul className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 lg:grid-cols-12">
          {chosen.map((project, i) => (
            <Reveal
              as="li"
              key={project.id}
              variant="clip"
              delay={i * 0.1}
              className={i === 0 && chosen.length > 1 ? "h-full md:col-span-2 lg:col-span-7 lg:row-span-2" : "h-full lg:col-span-5"}
            >
              <ProjectTile project={project} index={i} flagship={project.id === flagshipId} large={i === 0 && chosen.length > 1} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <EmptyState title="Projets à venir">Les études de cas seront bientôt publiées.</EmptyState>
      )}
    </div>
  );
}

function AboutLink() {
  return (
    <Link href="/a-propos" className="link-underline inline-flex items-center gap-2 font-medium">
      En savoir plus <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}

async function AboutSection() {
  const [profile, projects, timeline, testimonials] = await Promise.all([
    getProfile(),
    getProjects(),
    getTimeline(),
    getTestimonials(),
  ]);

  return (
    <div className="data-in">
      <SectionHeading
        index="02"
        eyebrow="À propos"
        id="apropos-title"
        title="Du réseau au code."
        lead={profile?.bio.split(/\n{2,}/)[0]}
        action={<AboutLink />}
      />
      <div className="mt-14 space-y-20 md:mt-20 md:space-y-28">
        <Facts
          facts={[
            {
              label: "Expériences en entreprise",
              value: timeline.filter((e) => e.kind === "experience").length,
              icon: BriefcaseBusiness,
            },
            {
              label: "Formations et certifications",
              value: timeline.filter((e) => e.kind === "education").length,
              icon: GraduationCap,
            },
            { label: "Projets publiés", value: projects.length, icon: FolderKanban },
            { label: "Langues parlées", value: profile?.languages.length ?? 0, icon: Languages },
          ]}
        />
        <TimelineBrief entries={timeline} />
        {profile && <Philosophy values={profile.values} />}
        <Testimonials items={testimonials} />
      </div>
    </div>
  );
}

async function ContactSection() {
  const profile = await getProfile();
  return <ContactCta email={profile?.email} />;
}
