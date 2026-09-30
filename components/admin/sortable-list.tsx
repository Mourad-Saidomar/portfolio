"use client";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

type Props<T> = {
  items: T[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, handle: ReactNode, index: number) => ReactNode;
  layout?: "list" | "grid";
  className?: string;
  itemClassName?: string;
};

/**
 * Liste réordonnable par glisser-déposer, à la souris, au doigt ou au clavier
 * (Espace pour saisir, flèches pour déplacer, Espace pour déposer, Échap pour annuler).
 */
export function SortableList<T>({
  items,
  getId,
  getLabel,
  onReorder,
  renderItem,
  layout = "list",
  className,
  itemClassName,
}: Props<T>) {
  // Identifiant stable serveur/client (sinon dnd-kit génère un compteur qui casse l'hydratation).
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const labelOf = (id: string | number) => {
    const item = items.find((i) => getId(i) === id);
    return item ? `« ${getLabel(item)} »` : "L'élément";
  };
  const positionOf = (id: string | number) => items.findIndex((i) => getId(i) === id) + 1;

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => getId(i) === active.id);
    const to = items.findIndex((i) => getId(i) === over.id);
    onReorder(arrayMove(items, from, to));
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Pour réordonner, appuyez sur Espace pour saisir l'élément, utilisez les flèches pour le déplacer, puis Espace pour le déposer ou Échap pour annuler.",
        },
        announcements: {
          onDragStart: ({ active }) => `${labelOf(active.id)} saisi, en position ${positionOf(active.id)} sur ${items.length}.`,
          onDragOver: ({ active, over }) =>
            over ? `${labelOf(active.id)} déplacé en position ${positionOf(over.id)} sur ${items.length}.` : "",
          onDragEnd: ({ active, over }) =>
            over ? `${labelOf(active.id)} déposé en position ${positionOf(over.id)} sur ${items.length}.` : "",
          onDragCancel: ({ active }) => `Déplacement annulé : ${labelOf(active.id)} reste à sa place.`,
        },
      }}
    >
      <SortableContext
        items={items.map(getId)}
        strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}
      >
        <ul className={className}>
          {items.map((item, index) => (
            <SortableItem key={getId(item)} id={getId(item)} label={getLabel(item)} className={itemClassName}>
              {(handle) => renderItem(item, handle, index)}
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: (handle: ReactNode) => ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...(listeners as ButtonHTMLAttributes<HTMLButtonElement>)}
      aria-label={`Réordonner « ${label} »`}
      className="inline-flex size-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-(--radius) text-subtle hover:bg-sunken hover:text-ink active:cursor-grabbing"
    >
      <GripVertical className="size-5" aria-hidden />
    </button>
  );

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(className, isDragging && "relative z-10 shadow-lift")}
    >
      {children(handle)}
    </li>
  );
}
