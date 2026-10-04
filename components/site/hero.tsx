import { Mail } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import type { Profile } from "@/lib/types";
import { Typewriter } from "./typewriter";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Mots de l'effet machine à écrire (« Je suis … »), tirés du CV. */
const ROLES = [
  "développeur web",
  "développeur web mobile",
  "en formation DWWM",
  "admin systèmes & réseaux",
  "passionné de code",
  "rigoureux et curieux",
  "basé à Mayotte",
  "en recherche de stage",
];

const WORD = "Portfolio";

/**
 * Séquence d'entrée (≈ 1 s, CSS pur) : titre → portrait → ligne de frappe → icônes → carte projet.
 * La carte est rendue hors du hero (chargement séparé) : elle reprend HERO_CARD_DELAY.
 * La frappe démarre à la fin de la séquence.
 */
export const HERO_CARD_DELAY = 650;
const SEQ = { letterStep: 30, portrait: 200, typing: 450, icons: 550, typingStart: 1000 } as const;

const iconLink =
  "inline-flex size-10 items-center justify-center rounded-full bg-ink/10 text-ink transition-colors duration-(--duration-fast) hover:bg-accent hover:text-on-accent";

/**
 * Hero de l'accueil, composé comme une affiche de film (plein écran, plans empilés) :
 *  z-0  le mot PORTFOLIO, étiré verticalement et lumineux (décoratif) ;
 *  z-10 le portrait détouré, ancré en bas et contenu dans la scène (overflow hidden) ;
 *  z-20 un fondu vers le fond, pour la lisibilité du premier plan ;
 *  z-30 le premier plan : effet machine à écrire en style titre, icônes de contact.
 * Le h1 (nom + métier) est réservé aux lecteurs d'écran et aux moteurs de recherche.
 * Défilement (CSS piloté par le scroll, transform/opacity uniquement) : le titre va moins vite
 * que le portrait, qui monte en rétrécissant ; tout s'estompe vers la carte du projet phare.
 * Mouvement réduit : entrée en fondus seuls, pas de parallaxe ; la frappe reste (rien ne bouge).
 */
export function Hero({ profile }: { profile: Profile }) {
  const { github, linkedin } = profile.socials;

  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="relative isolate h-[calc(100svh-var(--header-h))] min-h-[36rem] max-h-[68rem] overflow-hidden bg-(--hero-bg)">
        {/* Projecteur : halo clair au-dessus de la tête, comme un éclairage de studio. */}
        <div
          aria-hidden
          style={delay(0)}
          className="hero-glow-in absolute inset-0 -z-10 bg-[radial-gradient(42%_55%_at_50%_30%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%),radial-gradient(30%_35%_at_50%_22%,color-mix(in_oklab,var(--ink)_8%,transparent),transparent_70%)]"
        />

        <h1 id="hero-title" className="sr-only">
          {profile.fullName} — {profile.headline}
        </h1>

        {/* z-0 : le mot PORTFOLIO, étiré verticalement comme une affiche. */}
        <div aria-hidden className="absolute inset-x-0 top-[42%] z-0 -translate-y-1/2 select-none">
          <div className="hero-word-scroll">
            <p className="hero-name hero-backdrop text-center font-display text-[min(21vw,38vh)] leading-[0.8] uppercase">
              {[...WORD].map((letter, i) => (
                <span key={i} className="letter-in" style={delay(i * SEQ.letterStep)}>
                  {letter}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* z-10 : le portrait, ancré en bas ; ce qui dépasse sous la scène est coupé (overflow hidden). */}
        {profile.photo && (
          <div className="pointer-events-none absolute -bottom-[14%] left-1/2 z-10 h-[114%] w-[170vw] -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent)] sm:w-full sm:max-w-[72rem]">
            {/* Couches séparées : défilement (extérieure) et entrée (intérieure) n'utilisent pas le même transform. */}
            <div className="hero-photo-scroll relative size-full">
              <div className="hero-photo-in relative size-full" style={delay(SEQ.portrait)}>
                <Image
                  src={profile.photo.url}
                  alt={profile.photo.alt}
                  fill
                  priority
                  sizes="(min-width: 768px) 72rem, 170vw"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        )}

        {/* z-20 : fondu du buste vers le fond (lisibilité de la ligne de frappe). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[48%] bg-gradient-to-t from-(--hero-bg) from-10% via-(--hero-bg)/60 via-45% to-transparent"
        />

        {/* z-30 : premier plan, en bas. */}
        <div className="hero-fg-scroll absolute inset-x-0 bottom-0 z-30">
          <div className="container-page flex flex-col items-center gap-5 pb-6 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:pb-10">
            <ul className="hero-in order-2 flex gap-2 sm:order-none" style={delay(SEQ.icons)}>
              {github && (
                <li>
                  <a href={github} target="_blank" rel="me noopener noreferrer" className={iconLink}>
                    <GithubIcon className="size-[1.125rem]" />
                    <span className="sr-only">GitHub (nouvel onglet)</span>
                  </a>
                </li>
              )}
              {linkedin && (
                <li>
                  <a href={linkedin} target="_blank" rel="me noopener noreferrer" className={iconLink}>
                    <LinkedinIcon className="size-[1.125rem]" />
                    <span className="sr-only">LinkedIn (nouvel onglet)</span>
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${profile.email}`} className={iconLink}>
                  <Mail className="size-[1.125rem]" aria-hidden />
                  <span className="sr-only">Envoyer un e-mail</span>
                </a>
              </li>
            </ul>

            <div className="hero-in" style={delay(SEQ.typing)}>
              <Typewriter
                prefix="Je suis"
                words={ROLES}
                startDelay={SEQ.typingStart}
                className="hero-name text-center font-display text-[clamp(1.5rem,0.9rem+2.6vw,3.25rem)] leading-none uppercase"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
