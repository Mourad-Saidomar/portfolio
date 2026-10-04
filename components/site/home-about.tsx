import { ArrowRight, type LucideIcon, Quote } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatDate, formatPeriod } from "@/lib/format";
import type { Testimonial, TimelineEntry, TitledText } from "@/lib/types";
import { cn, isTodo } from "@/lib/utils";
import { CountUp } from "./interactive";
import { Reveal } from "./motion";

/*
 * Blocs de la section « À propos » de l'accueil.
 * Tout est calculé à partir du contenu publié (admin) : aucun chiffre saisi à la main.
 */

export type Fact = { label: string; value: number; icon: LucideIcon };

/** Repères chiffrés, en cartes (les nuls sont masqués). */
export function Facts({ facts }: { facts: Fact[] }) {
  const visible = facts.filter((f) => f.value > 0);
  if (visible.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* Chaque carte est directement le groupe dt/dd de la liste (structure exigée par <dl>). */}
      {visible.map(({ label, value, icon: Icon }, i) => (
        <Reveal
          key={label}
          delay={i * 0.08}
          className="relative flex h-full flex-col-reverse justify-end rounded-(--radius-lg) border border-line bg-surface p-5 pt-20 sm:justify-center sm:pt-5 sm:pl-[5.25rem] md:p-6 md:pl-[5.75rem]"
        >
          <dt className="mt-1.5 text-sm leading-snug text-muted">
            <span
              aria-hidden
              className="absolute top-5 left-5 inline-flex size-12 items-center justify-center rounded-(--radius) bg-accent-soft text-accent sm:top-1/2 sm:-translate-y-1/2 md:left-6"
            >
              <Icon className="size-5" />
            </span>
            {label}
          </dt>
          <dd className="font-display text-[clamp(2.5rem,2rem+1.6vw,3.25rem)] leading-none">
            <CountUp value={value} duration={1100 + i * 150} />
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}

/** Frise courte : expériences et étapes en cours, de la plus ancienne à la plus récente. */
export function TimelineBrief({ entries }: { entries: TimelineEntry[] }) {
  const steps = entries
    .filter((e) => e.kind === "experience" || e.isCurrent)
    .slice(0, 5)
    .reverse();
  if (steps.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-mono text-meta tracking-[0.08em] text-subtle uppercase">Parcours en bref</h3>
        <Link href="/parcours" className="link-underline inline-flex items-center gap-2 font-medium">
          Tout le parcours <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <div className="relative mt-8">
        <span aria-hidden className="absolute top-[6px] right-0 left-0 hidden h-px bg-line lg:block" />
        <ol
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))] lg:gap-6"
          style={{ "--steps": steps.length } as CSSProperties}
        >
        {steps.map((entry, i) => (
          <Reveal as="li" key={entry.id} delay={i * 0.08} className="relative lg:pt-8">
            <span
              aria-hidden
              className={cn(
                "absolute top-0 left-0 hidden size-[13px] rounded-full border-2 lg:block",
                entry.isCurrent ? "border-success bg-success" : "border-accent bg-bg",
              )}
            />
            <p className="font-display text-[2.25rem] leading-none text-accent">
              {entry.startDate ? formatDate(entry.startDate, "year") : "Aujourd'hui"}
            </p>
            <p className="mt-3 font-medium">{entry.title}</p>
            <p className="mt-1 text-sm text-muted">{entry.organization}</p>
            <p className="mt-2 font-mono text-[0.75rem] text-subtle">{formatPeriod(entry)}</p>
          </Reveal>
        ))}
        </ol>
      </div>
    </div>
  );
}

/** Philosophie : les valeurs du profil, numérotées. */
export function Philosophy({ values }: { values: TitledText[] }) {
  if (values.length === 0) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <p className="font-mono text-meta tracking-[0.08em] text-subtle uppercase">Philosophie</p>
        <h3 className="mt-4 font-display text-h2 uppercase">Ma façon de travailler</h3>
      </div>
      <ol className="border-t border-line lg:col-span-8">
        {values.map((value, i) => (
          <Reveal
            as="li"
            key={value.title}
            delay={i * 0.08}
            className="group grid gap-2 border-b border-line py-7 sm:grid-cols-[4.5rem_minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-6"
          >
            <span aria-hidden className="font-display text-[2rem] leading-none text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="font-display text-[1.75rem] leading-none uppercase">{value.title}</h4>
            <p className="text-muted">{value.description}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

/** Avis d'anciens collègues. Un avis encore « À COMPLÉTER » s'affiche comme un emplacement en pointillés. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="font-mono text-meta tracking-[0.08em] text-subtle uppercase">Avis</p>
      <h3 className="mt-4 font-display text-h2 uppercase">Ils ont travaillé avec moi</h3>
      {/* Grille asymétrique : le premier avis en grand, les suivants empilés à côté. */}
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const placeholder = [item.quote, item.authorName, item.authorRole].some(isTodo);
          const who = [item.authorRole, item.organization].filter(Boolean).join(" · ");
          return (
            <Reveal as="li" key={item.id} delay={i * 0.08} className={cn("h-full", i === 0 && items.length > 2 && "md:col-span-2 lg:row-span-2")}>
              <figure
                className={cn(
                  "flex h-full flex-col rounded-(--radius-lg) p-7",
                  placeholder ? "border border-dashed border-field" : "border border-line bg-surface",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <Quote aria-hidden className={cn("size-7", placeholder ? "text-subtle" : "text-accent")} />
                  {placeholder && (
                    <span className="rounded-(--radius-sm) border border-line px-2 py-0.5 font-mono text-[0.75rem] text-muted">
                      Emplacement à compléter
                    </span>
                  )}
                </div>
                <blockquote
                  className={cn(
                    "mt-6 flex-1 leading-relaxed",
                    i === 0 && items.length > 2 ? "text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-snug" : "text-lg",
                    placeholder && "text-muted",
                  )}
                >
                  <p>{item.quote}</p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-(--radius) bg-raised font-display text-lg text-accent"
                  >
                    {placeholder ? "?" : initials(item.authorName)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{item.authorName}</span>
                    {who && <span className="block text-sm text-muted">{who}</span>}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
