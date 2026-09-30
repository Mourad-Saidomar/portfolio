import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "inverse" | "inverse-outline";
type Size = "md" | "sm";

const base =
  "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-(--duration-fast) ease-(--ease-out) " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "border border-ink/80 text-ink hover:bg-ink hover:text-bg",
  ghost: "text-ink hover:bg-sunken",
  danger: "border border-danger/60 text-danger hover:bg-danger hover:text-bg",
  /** Sur fond encre (bandeaux sombres). */
  inverse: "bg-bg text-ink hover:bg-accent hover:text-on-accent",
  "inverse-outline": "border border-bg/40 text-bg hover:bg-bg hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 text-[0.9375rem]",
  sm: "min-h-11 px-4 text-sm",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type Common = { variant?: Variant; size?: Size; icon?: ReactNode; iconPosition?: "start" | "end" };

function Content({ children, icon, iconPosition = "end" }: { children: ReactNode } & Common) {
  const iconNode = icon ? (
    <span
      aria-hidden
      className="transition-transform duration-(--duration-base) ease-(--ease-out) group-hover/btn:translate-x-0.5"
    >
      {icon}
    </span>
  ) : null;
  return (
    <>
      {iconPosition === "start" && iconNode}
      {children}
      {iconPosition === "end" && iconNode}
    </>
  );
}

export function Button({
  variant,
  size,
  icon,
  iconPosition,
  className,
  children,
  ...props
}: ComponentProps<"button"> & Common) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconPosition,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & Common) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </Link>
  );
}

/** Lien externe ou fichier (pas de navigation client). */
export function ButtonAnchor({
  variant,
  size,
  icon,
  iconPosition,
  className,
  children,
  ...props
}: ComponentProps<"a"> & Common) {
  return (
    <a className={buttonClasses(variant, size, className)} {...props}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </a>
  );
}
