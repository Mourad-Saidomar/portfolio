import type { Metadata } from "next";
import { ContactCta } from "@/components/site/contact-cta";
import { EmptyState } from "@/components/site/empty-state";
import { PageTransition } from "@/components/site/page-transition";
import { Timeline } from "@/components/site/timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile, getTimeline } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Parcours",
  description: "Expériences professionnelles et formations : DWWM, BTS SIO SISR, stages à la DGFiP et à la mairie de Mamoudzou.",
  alternates: { canonical: "/parcours" },
};

export default async function TimelinePage() {
  const [entries, profile] = await Promise.all([getTimeline(), getProfile()]);

  return (
    <PageTransition>
      <section className="container-page pt-14 pb-16 md:pt-24">
        <SectionHeading
          as="h1"
          eyebrow="Parcours"
          title="Du réseau au code : un parcours construit pas à pas."
          lead="Mes expériences en entreprise et mes formations, de la plus récente à la plus ancienne. Utilisez le filtre pour n'afficher qu'un type d'étape."
        />
        <div className="mt-14 md:mt-20">
          {entries.length > 0 ? (
            <Timeline entries={entries} />
          ) : (
            <EmptyState title="Parcours en cours de rédaction" />
          )}
        </div>
      </section>
      <ContactCta email={profile?.email} />
    </PageTransition>
  );
}
