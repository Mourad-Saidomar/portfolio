import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ButtonAnchor } from "@/components/ui/button";
import { TagList } from "@/components/ui/tag";
import { isRichTextEmpty } from "@/lib/rich-text";
import type { Project, ProjectSummary } from "@/lib/types";
import { MaskWords } from "./mask-words";
import { ProjectCover } from "./project-cover";
import { RichText } from "./rich-text";

const SECTIONS = [
  { key: "context", label: "Contexte" },
  { key: "problem", label: "Problème" },
  { key: "role", label: "Mon rôle" },
  { key: "solution", label: "Solution" },
  { key: "results", label: "Résultats" },
] as const;

type Props = { project: Project; next?: ProjectSummary | null };

/** Étude de cas complète — partagée entre la page publique et l'aperçu admin. */
export function CaseStudy({ project, next }: Props) {
  const sections = SECTIONS.filter((s) => !isRichTextEmpty(project[s.key]));

  return (
    <article>
      <header className="container-page pt-10 md:pt-16">
        <Link
          href="/projets"
          transitionTypes={["nav-back"]}
          className="group inline-flex min-h-11 items-center gap-2 text-muted hover:text-ink"
        >
          <ArrowLeft
            className="size-4 transition-transform duration-(--duration-base) group-hover:-translate-x-0.5"
            aria-hidden
          />
          Tous les projets
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {project.period && <p className="font-mono text-meta text-subtle">{project.period}</p>}
            <h1 className="mt-4 font-display uppercase text-display">
              <MaskWords text={project.title} delay={80} />
            </h1>
            {project.summary && <p className="mt-6 max-w-[48ch] text-h3 text-muted">{project.summary}</p>}
          </div>

          <dl className="grid content-end gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            {project.stack.length > 0 && (
              <div>
                <dt className="font-mono text-meta text-subtle">Stack</dt>
                <dd className="mt-3">
                  <TagList items={project.stack} label="Technologies utilisées" />
                </dd>
              </div>
            )}
            {(project.demoUrl || project.repoUrl) && (
              <div>
                <dt className="font-mono text-meta text-subtle">Liens</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {project.demoUrl && (
                    <ButtonAnchor
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      icon={<ArrowUpRight className="size-4" />}
                    >
                      Voir la démo<span className="sr-only"> (nouvel onglet)</span>
                    </ButtonAnchor>
                  )}
                  {project.repoUrl && (
                    <ButtonAnchor
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="secondary"
                      icon={<GithubIcon className="size-4" />}
                      iconPosition="start"
                    >
                      Code source<span className="sr-only"> (nouvel onglet)</span>
                    </ButtonAnchor>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <div className="container-page mt-12 md:mt-16">
        <ViewTransition name={`project-cover-${project.slug}`}>
          <ProjectCover project={project} eager sizes="(min-width: 1320px) 1224px, 100vw" />
        </ViewTransition>
      </div>

      {sections.length > 0 && (
        <div className="container-page section-y">
          {sections.map((section, i) => (
            <section
              key={section.key}
              aria-labelledby={`section-${section.key}`}
              className="grid gap-6 border-t border-line py-12 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-8 md:py-16"
            >
              <div className="md:col-span-4">
                <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
                  <p className="font-mono text-meta text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h2 id={`section-${section.key}`} className="mt-2 font-display uppercase text-h2">
                    {section.label}
                  </h2>
                </div>
              </div>
              <RichText content={project[section.key]} className="text-lead md:col-span-8" />
            </section>
          ))}
        </div>
      )}

      {project.images.length > 0 && (
        <section aria-labelledby="captures" className="container-page pb-16 md:pb-24">
          <h2 id="captures" className="font-mono text-meta uppercase text-subtle">
            Captures
          </h2>
          <ul className="mt-6 grid gap-8 md:grid-cols-2">
            {project.images.map((image, i) => (
              <li key={image.id} className={i === 0 && project.images.length % 2 === 1 ? "md:col-span-2" : undefined}>
                <figure>
                  <div className="overflow-hidden rounded-(--radius-lg) border border-line bg-surface">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={image.width ?? 1600}
                      height={image.height ?? 1000}
                      sizes={i === 0 ? "(min-width: 1320px) 1224px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                      className="h-auto w-full"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="mt-3 font-mono text-meta text-subtle">{image.caption}</figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      {next && next.slug !== project.slug && (
        <nav aria-label="Projet suivant" className="border-t border-line">
          <Link
            href={`/projets/${next.slug}`}
            transitionTypes={["nav-forward"]}
            className="group container-page flex items-end justify-between gap-6 py-14 md:py-20"
          >
            <span>
              <span className="font-mono text-meta text-subtle">Projet suivant</span>
              <span className="mt-3 block font-display uppercase text-h1 transition-colors duration-(--duration-base) group-hover:text-accent">
                {next.title}
              </span>
            </span>
            <ArrowRight
              className="mb-3 size-8 shrink-0 transition-transform duration-(--duration-base) ease-(--ease-out) group-hover:translate-x-2"
              aria-hidden
            />
          </Link>
        </nav>
      )}
    </article>
  );
}
