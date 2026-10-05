import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { Reveal } from "@/components/site/motion";
import { PageTransition } from "@/components/site/page-transition";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectCardsSkeleton } from "@/components/site/skeletons";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile, getProjects } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projets",
  description: "Études de cas : contexte, problème, rôle, solution, stack et résultats de chaque projet.",
  path: "/projets",
});

/** Le titre s'affiche tout de suite ; la liste attend ses données derrière un squelette. */
export default function ProjectsPage() {
  return (
    <PageTransition>
      <section className="container-page pt-14 pb-16 md:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Projets — études de cas"
          title="Ce que j'ai construit, et pourquoi."
          lead="Chaque projet est présenté comme une étude de cas : le contexte, le problème à résoudre, mon rôle, la solution retenue et ce qu'elle a produit."
        />
        <Suspense fallback={<ProjectCardsSkeleton />}>
          <ProjectList />
        </Suspense>
      </section>
      <Suspense fallback={<ContactCta />}>
        <ContactSection />
      </Suspense>
    </PageTransition>
  );
}

async function ProjectList() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <div className="data-in mt-16">
        <EmptyState title="Projets à venir">Les études de cas seront bientôt publiées.</EmptyState>
      </div>
    );
  }
  return (
    <ul className="data-in mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2">
      {projects.map((project, i) => (
        <Reveal as="li" key={project.id} variant="clip" delay={(i % 2) * 0.12} className={i % 2 === 1 ? "md:mt-24" : undefined}>
          <ProjectCard project={project} index={i} headingLevel="h2" eager={i < 2} />
        </Reveal>
      ))}
    </ul>
  );
}

async function ContactSection() {
  const profile = await getProfile();
  return <ContactCta email={profile?.email} />;
}
