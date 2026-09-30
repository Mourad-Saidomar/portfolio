export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-(--radius-lg) border border-dashed border-line px-6 py-12 text-center">
      <p className="font-display text-h3">{title}</p>
      {children && <p className="mx-auto mt-3 max-w-[48ch] text-muted">{children}</p>}
    </div>
  );
}
