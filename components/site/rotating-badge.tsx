import { cn } from "@/lib/utils";

/** Badge circulaire au texte tournant (décoratif). Rotation lente, pausable, arrêtée en mouvement réduit. */
export function RotatingBadge({ text, className }: { text: string; className?: string }) {
  // Le texte fait le tour du cercle une fois (répété s'il est court) ; textLength ajuste l'espacement.
  const base = `${text} ✦ `;
  const label = (base.length < 22 ? base.repeat(2) : base).toUpperCase();
  return (
    <div
      aria-hidden
      className={cn(
        "grid place-items-center rounded-full border border-line bg-surface/90 text-ink shadow-lift backdrop-blur",
        className,
      )}
    >
      <svg viewBox="0 0 200 200" className="spin-slow ambient col-start-1 row-start-1 size-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text className="fill-current font-mono" style={{ fontSize: 13.5, letterSpacing: "0.18em" }}>
          <textPath href="#badge-circle" textLength="462">
            {label}
          </textPath>
        </text>
      </svg>
      <span className="col-start-1 row-start-1 size-3 rounded-full bg-coral" />
    </div>
  );
}
