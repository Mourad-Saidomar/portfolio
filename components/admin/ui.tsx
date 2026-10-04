import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-3 font-mono text-meta text-subtle">{eyebrow}</div>}
        <h1 className="font-display text-h2">{title}</h1>
        {description && <p className="mt-2 max-w-[60ch] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "accent" | "warning"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[0.6875rem] leading-5",
        tone === "neutral" && "bg-sunken text-muted",
        tone === "success" && "bg-success/12 text-success",
        tone === "accent" && "bg-accent-soft text-accent",
        tone === "warning" && "bg-warning/12 text-ink",
      )}
    >
      {children}
    </span>
  );
}

export function Panel({ title, description, children, id, className }: { title?: ReactNode; description?: ReactNode; children: ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} aria-labelledby={id && title ? `${id}-title` : undefined} className={cn("scroll-mt-8 rounded-(--radius-lg) border border-line bg-surface p-5 sm:p-7", className)}>
      {title && (
        <div className="mb-6">
          <h2 id={id ? `${id}-title` : undefined} className="font-display text-h3">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
