import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/site/case-study";
import { ContactCta } from "@/components/site/contact-cta";
import { PageTransition } from "@/components/site/page-transition";
import { getAdjacentProjects, getProfile, getProject, getProjects } from "@/lib/data/public";

/** Slug factice : Cache Components exige au moins un paramètre au build, même sans projet publié. */
const PLACEHOLDER = "aucun-projet";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.length > 0 ? projects.map((p) => ({ slug: p.slug })) : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Projet introuvable" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: { type: "article", title: project.title, description: project.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const [project, profile, { next }] = await Promise.all([
    getProject(slug),
    getProfile(),
    getAdjacentProjects(slug),
  ]);
  if (!project) notFound();

  return (
    <PageTransition>
      <CaseStudy project={project} next={next} />
      <ContactCta email={profile?.email} />
    </PageTransition>
  );
}
