import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/site/page-transition";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile } from "@/lib/data/public";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales et confidentialité",
  description: "Éditeur, hébergement et traitement des données personnelles du portfolio de Mourad Saidomar.",
  path: "/mentions-legales",
});

/* Rédigé à partir du fonctionnement réel du site (formulaire de contact, stockage local, admin). */

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8 md:py-12">
      <h2 id={id} className="font-display text-h3 uppercase md:col-span-4">
        {title}
      </h2>
      <div className="prose-case md:col-span-8">{children}</div>
    </section>
  );
}

export default async function LegalPage() {
  const profile = await getProfile();
  const name = profile?.fullName ?? "Mourad Saidomar";
  const email = profile?.email;

  return (
    <PageTransition>
      <section className="container-page pt-14 pb-24 md:pt-24 md:pb-32">
        <SectionHeading as="h1" eyebrow="Informations légales" title="Mentions légales et confidentialité." />

        <div className="mt-14 md:mt-20">
          <Block id="editeur" title="Éditeur">
            <p>
              Ce site est le portfolio personnel de {name}, particulier, {profile?.location || "Mayotte"}.
            </p>
            <p>Directeur de la publication : {name}.</p>
            {email && (
              <p>
                Contact : <a href={`mailto:${email}`}>{email}</a>
              </p>
            )}
          </Block>

          <Block id="hebergement" title="Hébergement">
            <p>
              Site : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (
              <a href="https://vercel.com">vercel.com</a>).
            </p>
            <p>
              Données et fichiers (base de données, images, CV) : Supabase Inc. (
              <a href="https://supabase.com">supabase.com</a>).
            </p>
          </Block>

          <Block id="donnees" title="Données personnelles">
            <p>Le seul traitement de données personnelles est le formulaire de contact. Il enregistre :</p>
            <ul>
              <li>vos nom, adresse e-mail et message, ainsi que la date d&apos;envoi ;</li>
              <li>
                une empreinte chiffrée de votre adresse IP (et non l&apos;adresse elle-même), utilisée uniquement pour
                limiter les envois abusifs.
              </li>
            </ul>
            <p>
              Finalité : répondre à votre message. Ces données ne sont ni vendues, ni cédées, ni utilisées à des fins
              commerciales. Seul l&apos;éditeur y a accès ; les prestataires d&apos;hébergement ci-dessus les stockent
              pour son compte.
            </p>
            <p>Durée de conservation : 12 mois après réception du message, puis suppression.</p>
            <p>
              Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données à tout moment
              {email ? (
                <>
                  {" "}
                  en écrivant à <a href={`mailto:${email}`}>{email}</a>
                </>
              ) : null}
              . Vous pouvez aussi adresser une réclamation à la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).
            </p>
          </Block>

          <Block id="cookies" title="Cookies et stockage">
            <p>Ce site n&apos;utilise aucun cookie publicitaire ni outil de mesure d&apos;audience.</p>
            <p>
              Votre navigateur conserve seulement votre choix « Mettre en pause les animations » (stockage local), pour
              l&apos;appliquer à votre prochaine visite. L&apos;espace d&apos;administration, réservé à l&apos;éditeur,
              utilise des cookies de connexion strictement nécessaires.
            </p>
          </Block>

          <Block id="propriete" title="Propriété intellectuelle">
            <p>
              Les textes, photos et réalisations présentés sur ce site appartiennent à {name}, sauf mention contraire.
              Toute reproduction sans autorisation est interdite.
            </p>
            <p>
              <Link href="/contact">Une question ? Écrivez-moi.</Link>
            </p>
          </Block>
        </div>
      </section>
    </PageTransition>
  );
}
