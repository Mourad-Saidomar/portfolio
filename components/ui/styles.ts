/** Classes partagées (module neutre : importable côté serveur comme côté client). */

export const inputClasses =
  "block w-full rounded-(--radius) border border-field bg-surface px-4 py-3 text-base text-ink " +
  "placeholder:text-subtle transition-[border-color,box-shadow] duration-(--duration-fast) " +
  "hover:border-ink/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/25 disabled:opacity-60";
