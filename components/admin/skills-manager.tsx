"use client";

import { Plus, Save, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { inputClasses } from "@/components/ui/styles";
import {
  addSkill,
  deleteSkill,
  deleteSkillCategory,
  reorder,
  saveSkillCategory,
} from "@/lib/actions/admin/content";
import { SortableList } from "./sortable-list";
import { useToast } from "./toaster";

type Skill = { id: string; name: string };
type Category = { id: string; name: string; description: string; skills: Skill[] };

export function SkillsManager({ initial }: { initial: Category[] }) {
  const [categories, setCategories] = useState(initial);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function run<T>(
    task: () => Promise<{ ok: true; data?: T; message?: string } | { ok: false; error: string }>,
    onSuccess?: (data: T | undefined) => void,
    rollback?: () => void,
  ) {
    startTransition(async () => {
      const result = await task();
      if (result.ok) {
        onSuccess?.(result.data);
        if (result.message) toast(result.message);
        router.refresh();
      } else {
        rollback?.();
        toast(result.error, "error");
      }
    });
  }

  const updateCategory = (id: string, patch: Partial<Category>) =>
    setCategories((all) => all.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div className="grid grid-cols-1 gap-8" aria-busy={pending}>
      <SortableList
        items={categories}
        getId={(c) => c.id}
        getLabel={(c) => c.name}
        onReorder={(next) => {
          const previous = categories;
          setCategories(next);
          run(() => reorder({ table: "skill_categories", ids: next.map((c) => c.id) }), undefined, () => setCategories(previous));
        }}
        className="grid gap-4"
        itemClassName="rounded-(--radius-lg) border border-line bg-surface"
        renderItem={(category, handle) => (
          <CategoryCard
            category={category}
            handle={handle}
            onSave={(name, description) =>
              run(() => saveSkillCategory({ id: category.id, name, description }), () => updateCategory(category.id, { name, description }))
            }
            onDelete={() => {
              if (!window.confirm(`Supprimer la catégorie « ${category.name} » et ses ${category.skills.length} compétence(s) ?`)) return;
              const previous = categories;
              setCategories((all) => all.filter((c) => c.id !== category.id));
              run(() => deleteSkillCategory(category.id), undefined, () => setCategories(previous));
            }}
            onAddSkill={(name) =>
              run(
                () => addSkill({ categoryId: category.id, name }),
                (skill) => skill && updateCategory(category.id, { skills: [...category.skills, skill] }),
              )
            }
            onDeleteSkill={(skill) => {
              const previous = category.skills;
              updateCategory(category.id, { skills: previous.filter((s) => s.id !== skill.id) });
              run(() => deleteSkill(skill.id), undefined, () => updateCategory(category.id, { skills: previous }));
            }}
            onReorderSkills={(skills) => {
              const previous = category.skills;
              updateCategory(category.id, { skills });
              run(() => reorder({ table: "skills", ids: skills.map((s) => s.id) }), undefined, () =>
                updateCategory(category.id, { skills: previous }),
              );
            }}
          />
        )}
      />

      <NewCategory
        onCreate={(name, description, done) =>
          run(
            () => saveSkillCategory({ name, description }),
            (data) => {
              if (data) setCategories((all) => [...all, { id: data.id, name, description, skills: [] }]);
              done();
            },
          )
        }
      />
    </div>
  );
}

function CategoryCard({
  category,
  handle,
  onSave,
  onDelete,
  onAddSkill,
  onDeleteSkill,
  onReorderSkills,
}: {
  category: Category;
  handle: React.ReactNode;
  onSave: (name: string, description: string) => void;
  onDelete: () => void;
  onAddSkill: (name: string) => void;
  onDeleteSkill: (skill: Skill) => void;
  onReorderSkills: (skills: Skill[]) => void;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [draft, setDraft] = useState("");
  const dirty = name !== category.name || description !== category.description;

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start gap-2">
        {handle}
        <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr]">
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Catégorie</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputClasses} py-2`} />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium">Description</span>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClasses} py-2`} />
          </label>
        </div>
        <div className="flex gap-1 pt-6">
          {dirty && (
            <button
              type="button"
              onClick={() => name.trim() && onSave(name.trim(), description.trim())}
              className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-on-accent"
              aria-label={`Enregistrer la catégorie ${category.name}`}
            >
              <Save className="size-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-danger"
            aria-label={`Supprimer la catégorie ${category.name}`}
          >
            <Trash className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-4 sm:pl-13">
        {category.skills.length > 0 && (
          <SortableList
            items={category.skills}
            getId={(s) => s.id}
            getLabel={(s) => s.name}
            onReorder={onReorderSkills}
            layout="grid"
            className="flex flex-wrap gap-2"
            itemClassName="rounded-full"
            renderItem={(skill, skillHandle) => (
              <span className="inline-flex items-center rounded-full border border-line bg-bg text-sm [&>button:first-child]:size-9">
                {skillHandle}
                <span className="pr-1">{skill.name}</span>
                <button
                  type="button"
                  onClick={() => onDeleteSkill(skill)}
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:text-danger"
                  aria-label={`Supprimer ${skill.name}`}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </span>
            )}
          />
        )}
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            onAddSkill(draft.trim());
            setDraft("");
          }}
        >
          <label className="sr-only" htmlFor={`skill-${category.id}`}>
            Nouvelle compétence dans {category.name}
          </label>
          <input
            id={`skill-${category.id}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Nouvelle compétence…"
            className={`${inputClasses} max-w-xs py-2`}
          />
          <Button type="submit" size="sm" variant="secondary" icon={<Plus className="size-4" />} iconPosition="start">
            Ajouter
          </Button>
        </form>
      </div>
    </div>
  );
}

function NewCategory({ onCreate }: { onCreate: (name: string, description: string, done: () => void) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate(name.trim(), description.trim(), () => {
          setName("");
          setDescription("");
        });
      }}
      className="grid gap-3 rounded-(--radius-lg) border border-dashed border-field p-5 sm:grid-cols-[1fr_2fr_auto] sm:items-end"
    >
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Nouvelle catégorie</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputClasses} py-2`} required />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="font-medium">Description</span>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClasses} py-2`} />
      </label>
      <Button type="submit" size="sm" icon={<Plus className="size-4" />} iconPosition="start">
        Créer
      </Button>
    </form>
  );
}
