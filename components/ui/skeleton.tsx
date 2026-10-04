import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Bloc de chargement neutre avec un reflet discret (shimmer).
 * Décoratif : masqué des technologies d'assistance. Reflet coupé en mouvement réduit
 * et suspendu par le bouton « Mettre en pause les animations ».
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div aria-hidden className={cn("skeleton", className)} {...props} />;
}

/** Lignes de texte : hauteur d'une ligne réelle (`line`), dernière ligne plus courte. */
export function SkeletonText({
  lines = 3,
  line = "h-[1.65em]",
  className,
}: {
  lines?: number;
  line?: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("grid", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={cn("flex items-center", line)}>
          <Skeleton className={cn("h-[0.7em] rounded-full", i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")} />
        </div>
      ))}
    </div>
  );
}

/**
 * Zone en cours de chargement : annonce sobre aux lecteurs d'écran (une seule fois),
 * le reste est décoratif.
 */
export function SkeletonRegion({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
