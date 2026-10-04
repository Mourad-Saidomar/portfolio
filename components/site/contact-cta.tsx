import { ArrowRight, Mail } from "lucide-react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Magnetic, RevealWords } from "./interactive";
import { Reveal } from "./motion";

/**
 * Bandeau de fin de page : un seul objectif, me contacter.
 * Surface relevée sur le fond de page, avec une « aurore » lagon en mouvement lent.
 */
export function ContactCta({ email }: { email?: string | null }) {
  return (
    <section aria-labelledby="cta-title" className="container-page pb-[clamp(4.5rem,3rem+7vw,9rem)]">
      <Reveal
        variant="clip"
        className="relative isolate overflow-hidden rounded-[28px] border border-line bg-surface px-6 py-16 sm:px-10 md:px-16 md:py-24"
      >
        <div aria-hidden className="aurora ambient absolute inset-0 -z-10" />
        <div aria-hidden className="line-grid absolute inset-0 -z-10" />

        <p className="flex items-center gap-3 font-mono text-meta tracking-[0.08em] text-muted uppercase">
          <span aria-hidden className="h-px w-8 bg-accent" />
          Contact
        </p>
        <h2 id="cta-title" className="mt-6 max-w-[14ch] font-display text-[clamp(3rem,1.5rem+6vw,7rem)] leading-[0.9] uppercase">
          <RevealWords text={"Un stage, un projet, une question ?"} />
        </h2>
        <p className="mt-6 max-w-[48ch] text-lead text-muted">
          Je réponds à chaque message. Le plus simple : quelques lignes via le formulaire, ou un e-mail direct.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Magnetic>
            <ButtonLink href="/contact" icon={<ArrowRight className="size-4" />}>
              Écrire un message
            </ButtonLink>
          </Magnetic>
          {email && (
            <Magnetic>
              <ButtonAnchor href={`mailto:${email}`} variant="secondary" icon={<Mail className="size-4" />} iconPosition="start">
                Envoyer un e-mail
              </ButtonAnchor>
            </Magnetic>
          )}
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -bottom-16 font-display text-[16rem] leading-none text-ink/[0.04] select-none md:-bottom-24 md:text-[24rem]"
        >
          @
        </span>
      </Reveal>
    </section>
  );
}
