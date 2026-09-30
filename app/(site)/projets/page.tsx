import type { Metadata } from "next";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { Reveal } from "@/components/site/motion";
import { PageTransition } from "@/components/site/page-transition";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile, getProjects } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Projets",
  description: "Études de cas : contexte, problème, rôle, solution, stack et résultats de chaque projet.",
  alternates: { canonical: "/projets" },
};

export default async function ProjectsPage() {
  const [projects, profile] = await Promise.all([getProjects(), getProfile()]);

  return (
    <PageTransition>
      <section className="container-page pt-14 pb-16 md:pt-24">
        <SectionHeading
          as="h1"
          eyebrow={`Projets — ${projects.length} étude${projects.length > 1 ? "s" : ""} de cas`}
          title="Ce que j'ai construit, et pourquoi."
          lead="Chaque projet est présenté comme une étude de cas : le contexte, le problème à résoudre, mon rôle, la solution retenue et ce qu'elle a produit."
        />
        {projects.length > 0 ? (
          <ul className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal as="li" key={project.id} delay={(i % 2) * 0.08}>
                <ProjectCard project={project} index={i} headingLevel="h2" priority={i < 2} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-16">
            <EmptyState title="Projets à venir">Les études de cas seront bientôt publiées.</EmptyState>
          </div>
        )}
      </section>
      <ContactCta email={profile?.email} />
    </PageTransition>
  );
}
