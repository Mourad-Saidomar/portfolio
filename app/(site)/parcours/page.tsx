import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { PageTransition } from "@/components/site/page-transition";
import { TimelineSkeleton } from "@/components/site/skeletons";
import { Timeline } from "@/components/site/timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile, getTimeline } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Parcours",
  description: "Expériences professionnelles et formations : DWWM, BTS SIO SISR, stages à la DGFiP et à la mairie de Mamoudzou.",
  path: "/parcours",
});

/** Le titre s'affiche tout de suite ; le parcours attend ses données derrière un squelette. */
export default function TimelinePage() {
  return (
    <PageTransition>
      <section className="container-page pt-14 pb-16 md:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Parcours"
          title={"Du réseau au code : un parcours construit pas à pas."}
          lead="Mes expériences en entreprise et mes formations, de la plus récente à la plus ancienne. Utilisez le filtre pour n'afficher qu'un type d'étape."
        />
        <div className="mt-14 md:mt-20">
          <Suspense fallback={<TimelineSkeleton />}>
            <TimelineList />
          </Suspense>
        </div>
      </section>
      <Suspense fallback={<ContactCta />}>
        <ContactSection />
      </Suspense>
    </PageTransition>
  );
}

async function TimelineList() {
  const entries = await getTimeline();
  return (
    <div className="data-in">
      {entries.length > 0 ? <Timeline entries={entries} /> : <EmptyState title="Parcours en cours de rédaction" />}
    </div>
  );
}

async function ContactSection() {
  const profile = await getProfile();
  return <ContactCta email={profile?.email} />;
}
