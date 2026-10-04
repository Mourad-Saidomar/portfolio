"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reorder } from "@/lib/actions/admin/content";
import { isTodo } from "@/lib/utils";
import { SortableList } from "./sortable-list";
import { useToast } from "./toaster";
import { Badge } from "./ui";

export type TestimonialRow = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  published: boolean;
};

/** Liste des avis, réordonnable par glisser-déposer (l'ordre est celui de l'accueil). */
export function TestimonialsManager({ initial }: { initial: TestimonialRow[] }) {
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function handleReorder(next: TestimonialRow[]) {
    const previous = items;
    setItems(next);
    startTransition(async () => {
      const result = await reorder({ table: "testimonials", ids: next.map((t) => t.id) });
      if (result.ok) {
        if (result.message) toast(result.message);
        router.refresh();
      } else {
        setItems(previous);
        toast(result.error, "error");
      }
    });
  }

  return (
    <div aria-busy={pending}>
      <SortableList
        items={items}
        getId={(t) => t.id}
        getLabel={(t) => t.authorName}
        onReorder={handleReorder}
        className="divide-y divide-line rounded-(--radius-lg) border border-line bg-surface"
        itemClassName="bg-surface first:rounded-t-(--radius-lg) last:rounded-b-(--radius-lg)"
        renderItem={(item, handle, index) => (
          <div className="flex items-center gap-3 p-3 sm:gap-4">
            {handle}
            <span className="hidden w-6 font-mono text-meta text-subtle sm:block">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/avis/${item.id}`} className="font-medium hover:text-accent">
                  {item.authorName}
                </Link>
                {[item.quote, item.authorName, item.authorRole].some(isTodo) && <Badge tone="warning">À compléter</Badge>}
                <Badge tone={item.published ? "success" : "neutral"}>{item.published ? "Visible" : "Masqué"}</Badge>
              </div>
              <p className="mt-0.5 truncate text-sm text-muted">« {item.quote} »</p>
            </div>
            <Link
              href={`/admin/avis/${item.id}`}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-ink"
            >
              <Pencil className="size-4" aria-hidden />
              <span className="sr-only">Modifier l&apos;avis de {item.authorName}</span>
            </Link>
          </div>
        )}
      />
    </div>
  );
}
