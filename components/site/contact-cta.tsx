import { ArrowRight, Mail } from "lucide-react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Reveal } from "./motion";

/** Bandeau de fin de page : un seul objectif, me contacter. */
export function ContactCta({ email }: { email?: string | null }) {
  return (
    <section aria-labelledby="cta-title" className="container-page section-y">
      <Reveal className="relative overflow-hidden rounded-(--radius-lg) bg-ink px-6 py-14 text-bg sm:px-10 md:px-16 md:py-20">
        <p className="font-mono text-meta uppercase text-bg/70">Contact</p>
        <h2 id="cta-title" className="mt-4 max-w-[18ch] font-display text-h1">
          Un stage, un projet, une question&nbsp;?
        </h2>
        <p className="mt-5 max-w-[52ch] text-lead text-bg/80">
          Je réponds à chaque message. Le plus simple : quelques lignes via le formulaire, ou un e-mail direct.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink
            href="/contact"
            variant="inverse"
            icon={<ArrowRight className="size-4" />}
          >
            Écrire un message
          </ButtonLink>
          {email && (
            <ButtonAnchor
              href={`mailto:${email}`}
              variant="inverse-outline"
              icon={<Mail className="size-4" />}
              iconPosition="start"
            >
              Envoyer un e-mail
            </ButtonAnchor>
          )}
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-24 font-display text-[18rem] leading-none text-bg/[0.04] select-none md:text-[26rem]"
        >
          @
        </span>
      </Reveal>
    </section>
  );
}
