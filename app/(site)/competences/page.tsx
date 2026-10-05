import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { Reveal } from "@/components/site/motion";
import { PageTransition } from "@/components/site/page-transition";
import { SkillsSkeleton } from "@/components/site/skeletons";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile, getSkillCategories } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Compétences",
  description: "Compétences front-end, back-end, outils et savoir-être, regroupées par domaine.",
  path: "/competences",
});

/** Le titre s'affiche tout de suite ; les compétences attendent leurs données derrière un squelette. */
export default function SkillsPage() {
  return (
    <PageTransition>
      <section className="container-page pt-14 pb-16 md:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Compétences"
          title="Une boîte à outils, pas une jauge."
          lead="Pas de pourcentages arbitraires : mes compétences sont regroupées par domaine, et chacune se retrouve dans mes projets ou mes stages."
        />
        <Suspense fallback={<SkillsSkeleton />}>
          <SkillList />
        </Suspense>
      </section>
      <Suspense fallback={<ContactCta />}>
        <ContactSection />
      </Suspense>
    </PageTransition>
  );
}

async function SkillList() {
  const categories = await getSkillCategories();

  if (categories.length === 0) {
    return (
      <div className="data-in mt-16">
        <EmptyState title="Compétences en cours de rédaction" />
      </div>
    );
  }
  return (
    <div className="data-in mt-14 border-t border-line md:mt-20">
      {categories.map((category, i) => (
        <Reveal key={category.id}>
          <section aria-labelledby={`cat-${category.id}`} className="grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-14">
            <div className="md:col-span-4">
              <p className="font-mono text-meta text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h2 id={`cat-${category.id}`} className="mt-2 font-display uppercase text-h2">
                {category.name}
              </h2>
              {category.description && <p className="mt-3 max-w-[36ch] text-muted">{category.description}</p>}
            </div>
            <ul className="flex flex-wrap content-start gap-2 md:col-span-8">
              {category.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-[0.9375rem] transition-colors duration-(--duration-fast) hover:border-accent"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

async function ContactSection() {
  const profile = await getProfile();
  return <ContactCta email={profile?.email} />;
}
