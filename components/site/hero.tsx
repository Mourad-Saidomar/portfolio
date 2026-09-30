import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import { type CSSProperties, Fragment } from "react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import type { Profile } from "@/lib/types";
import { CountUp, Magnetic } from "./interactive";
import { RotatingBadge } from "./rotating-badge";

type Fact = { label: string; value: number };
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Hero de l'accueil. Chorégraphie d'entrée en CSS pur (aucune attente du JavaScript) :
 * lieu → nom (lignes masquées) → métier → accroche → actions → portrait (rideau).
 * Le paragraphe d'introduction, souvent l'élément LCP, glisse sans fondu : il est peint immédiatement.
 */
export function Hero({ profile, facts }: { profile: Profile; facts: Fact[] }) {
  const nameLines = profile.fullName.split(/\s+/).filter(Boolean);
  const region = profile.location.split(",").pop()?.trim() || profile.location;

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Décor : grille pointillée + halos lagon/corail qui dérivent lentement. */}
      <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
      <div aria-hidden className="glow glow-accent ambient -z-10 -top-[25%] -right-[20%] size-[90vw] lg:size-[60vw]" />
      <div aria-hidden className="glow glow-coral ambient -z-10 top-[45%] -left-[25%] size-[80vw] lg:size-[45vw]" />

      <div className="container-page pt-10 pb-16 sm:pt-14 md:pb-24 lg:pt-20">
        <div className="enter flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-meta text-subtle" style={delay(0)}>
          {profile.availability && (
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-ink backdrop-blur">
              <span className="relative flex size-2" aria-hidden>
                <span className="ambient absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {profile.availability}
            </span>
          )}
          {profile.location && <span>{profile.location}</span>}
        </div>

        <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {/* Texte écrit une seule fois (lecteurs d'écran, moteurs de recherche) ; espaces réelles entre les lignes. */}
            <h1 id="hero-title">
              <span className="block font-display text-[clamp(4.25rem,0.5rem+17vw,11.5rem)] leading-[0.86] tracking-[-0.035em]">
                {nameLines.map((line, i) => (
                  <Fragment key={line}>
                    <span className={i % 2 === 1 ? "block lg:pl-[14%]" : "block"}>
                      <span className="mask-line">
                        <span style={delay(120 + i * 110)}>{line}</span>
                      </span>
                    </span>
                    {i < nameLines.length - 1 && " "}
                  </Fragment>
                ))}
              </span>
              <span className="sr-only">, </span>
              <span className="mt-7 flex items-center gap-4">
                <span aria-hidden className="draw-line h-px w-12 shrink-0 bg-accent sm:w-20" style={delay(420)} />
                <span className="enter text-h3 text-accent" style={delay(460)}>
                  {profile.headline}
                </span>
              </span>
            </h1>

            {profile.tagline && (
              <p className="enter mt-10 max-w-[30ch] font-display text-h2 text-ink" style={delay(560)}>
                {profile.tagline}
              </p>
            )}
            {profile.intro && (
              <p className="enter-soft mt-6 max-w-[58ch] text-lead text-muted" style={delay(620)}>
                {profile.intro}
              </p>
            )}

            <div className="enter mt-10 flex flex-wrap items-center gap-3" style={delay(720)}>
              <Magnetic>
                <ButtonLink href="/projets" icon={<ArrowRight className="size-4" />}>
                  Voir les projets
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink href="/contact" variant="secondary">
                  Me contacter
                </ButtonLink>
              </Magnetic>
              {profile.cvUrl && (
                <ButtonAnchor href="/cv" variant="ghost" icon={<Download className="size-4" />} iconPosition="start">
                  CV (PDF)
                </ButtonAnchor>
              )}
            </div>
          </div>

          {profile.photo && (
            <figure className="relative mx-auto w-full max-w-sm self-end lg:col-span-4 lg:max-w-none">
              <div className="curtain relative aspect-[4/5] overflow-hidden rounded-(--radius-lg) bg-sunken" style={delay(300)}>
                <Image
                  src={profile.photo.url}
                  alt={profile.photo.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 384px, 100vw"
                  className="object-cover object-top"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
                <div aria-hidden className="absolute inset-x-4 bottom-4 flex justify-between font-mono text-meta text-white/90">
                  <span>{profile.fullName}</span>
                  <span>{region}</span>
                </div>
              </div>
              <div className="enter absolute -top-12 -left-8 z-10 hidden sm:block lg:-left-14" style={delay(900)}>
                <RotatingBadge text={`${profile.headline} ✦ ${region}`} className="size-32 lg:size-36" />
              </div>
            </figure>
          )}
        </div>

        {facts.length > 0 && (
          <dl className="mt-20 grid grid-cols-2 border-t border-line md:mt-28 md:grid-cols-4">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className="border-b border-line py-6 pr-4 md:border-b-0 md:border-l md:pl-6 md:first:border-l-0 md:first:pl-0"
              >
                <dt className="font-mono text-meta text-subtle">{fact.label}</dt>
                <dd className="mt-2 font-display text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-none">
                  <CountUp value={fact.value} duration={1200 + i * 150} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
