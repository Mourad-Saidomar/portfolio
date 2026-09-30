import { ArrowRight, Mail } from "lucide-react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Magnetic, RevealWords } from "./interactive";
import { Reveal } from "./motion";

/**
 * Bandeau de fin de page : un seul objectif, me contacter.
 * Toujours sombre (dans les deux thèmes), avec une « aurore » lagon en mouvement lent.
 */
export function ContactCta({ email }: { email?: string | null }) {
  return (
    <section aria-labelledby="cta-title" className="container-page pb-[clamp(4.5rem,3rem+7vw,9rem)]">
      <Reveal
        variant="clip"
        className="relative isolate overflow-hidden rounded-[28px] bg-[#0b1214] px-6 py-16 text-[#f5f2ec] sm:px-10 md:px-16 md:py-24"
      >
        <div aria-hidden className="aurora ambient absolute inset-0 -z-10" />

        <p className="flex items-center gap-3 font-mono text-meta uppercase text-[#f5f2ec]/80">
          <span aria-hidden className="h-px w-8 bg-[#f5f2ec]/50" />
          Contact
        </p>
        <h2
          id="cta-title"
          className="mt-6 max-w-[16ch] font-display text-[clamp(2.75rem,1.5rem+5vw,6rem)] leading-[0.95] tracking-[-0.025em]"
        >
          <RevealWords text="Un stage, un projet, une question ?" />
        </h2>
        <p className="mt-6 max-w-[48ch] text-lead text-[#f5f2ec]/85">
          Je réponds à chaque message. Le plus simple : quelques lignes via le formulaire, ou un e-mail direct.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Magnetic>
            <ButtonLink href="/contact" variant="inverse" icon={<ArrowRight className="size-4" />}>
              Écrire un message
            </ButtonLink>
          </Magnetic>
          {email && (
            <Magnetic>
              <ButtonAnchor
                href={`mailto:${email}`}
                variant="inverse-outline"
                icon={<Mail className="size-4" />}
                iconPosition="start"
              >
                Envoyer un e-mail
              </ButtonAnchor>
            </Magnetic>
          )}
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute -right-8 -bottom-20 font-display text-[16rem] leading-none text-[#f5f2ec]/[0.05] select-none md:-bottom-28 md:text-[24rem]"
        >
          @
        </span>
      </Reveal>
    </section>
  );
}
