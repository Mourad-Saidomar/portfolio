/** Concatène des classes CSS en ignorant les valeurs falsy. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Contenu marqué « À COMPLÉTER » (placeholder éditorial). */
export function isTodo(value: string | null | undefined): boolean {
  return Boolean(value && /À COMPLÉTER/i.test(value));
}
