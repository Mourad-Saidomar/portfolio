import type { ReactNode } from "react";
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

/** Titre de section éditorial : index mono + filet, titre serif, chapeau. */
export function SectionHeading({ index, eyebrow, title, lead, as: Tag = "h2", id, className, action }: Props) {
  return (
    <header className={cn("grid gap-6 md:grid-cols-12 md:gap-8", className)}>
      <p className="flex items-center gap-3 font-mono text-meta uppercase text-subtle md:col-span-12">
        {index && <span className="text-coral">{index}</span>}
        <span aria-hidden className="h-px w-8 bg-line" />
        <span>{eyebrow}</span>
      </p>
      <div className="md:col-span-8">
        <Tag id={id} className={cn("font-display", Tag === "h1" ? "text-h1" : "text-h2")}>
          {title}
        </Tag>
        {lead && <div className="mt-5 max-w-[60ch] text-lead text-muted">{lead}</div>}
      </div>
      {action && <div className="flex items-end md:col-span-4 md:justify-end">{action}</div>}
    </header>
  );
}
