/** Squelette affiché pendant le rendu d'une étude de cas publiée après le dernier build. */
export default function Loading() {
  return (
    <div className="container-page pt-10 md:pt-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement du projet…</span>
      <div className="h-11 w-40 rounded-full bg-sunken" />
      <div className="mt-8 h-24 w-3/4 animate-pulse rounded-(--radius) bg-sunken motion-reduce:animate-none" />
      <div className="mt-6 h-8 w-1/2 rounded-(--radius) bg-sunken" />
      <div className="mt-16 aspect-[16/10] w-full rounded-(--radius-lg) bg-sunken" />
    </div>
  );
}
