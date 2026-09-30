import type { CSSProperties, ReactNode } from "react";
import { RevealWords } from "@/components/site/interactive";
import { MaskWords } from "@/components/site/mask-words";
import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  action?: ReactNode;
};

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Titre de section éditorial : index mono + filet, titre serif, chapeau.
 * h1 (haut de page) : chorégraphie d'entrée en CSS au chargement.
 * h2 (plus bas) : mots révélés à l'entrée dans l'écran.
 */
export function SectionHeading({ index, eyebrow, title, lead, as: Tag = "h2", id, className, action }: Props) {
  const isPageTitle = Tag === "h1";

  return (
    <header className={cn("grid gap-6 md:grid-cols-12 md:gap-8", className)}>
      <p
        className={cn("flex items-center gap-3 font-mono text-meta uppercase text-subtle md:col-span-12", isPageTitle && "enter")}
      >
        {index && <span className="text-coral">{index}</span>}
        <span aria-hidden className={cn("h-px w-8 bg-accent", isPageTitle && "draw-line")} style={delay(150)} />
        <span>{eyebrow}</span>
      </p>
      <div className="md:col-span-9 lg:col-span-8">
        <Tag
          id={id}
          className={cn(
            "font-display",
            isPageTitle ? "text-[clamp(2.75rem,1.4rem+5.4vw,6.25rem)] leading-[0.95] tracking-[-0.025em]" : "text-h2",
          )}
        >
          {typeof title !== "string" ? title : isPageTitle ? <MaskWords text={title} delay={120} /> : <RevealWords text={title} />}
        </Tag>
        {lead && (
          <div className={cn("mt-6 max-w-[60ch] text-lead text-muted", isPageTitle && "enter-soft")} style={delay(380)}>
            {lead}
          </div>
        )}
      </div>
      {action && <div className="flex items-end md:col-span-3 md:justify-end lg:col-span-4">{action}</div>}
    </header>
  );
}
