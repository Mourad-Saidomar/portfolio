"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, LoaderCircle, Send, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { inputClasses } from "@/components/ui/styles";
import { deleteProject, saveProject } from "@/lib/actions/admin/projects";
import { slugify } from "@/lib/format";
import { type ProjectFormValues, projectSchema } from "@/lib/validation/admin";
import { ImageField } from "./image-field";
import { ImagesManager } from "./images-manager";
import { RichTextEditor } from "./rich-text-editor";
import { TagInput } from "./tag-input";
import { useToast } from "./toaster";
import { Badge, Panel } from "./ui";

const CASE_STUDY = [
  { name: "context", label: "Contexte", hint: "Le cadre : pour qui, dans quelle situation, avec quelles contraintes." },
  { name: "problem", label: "Problème", hint: "Ce qui devait être résolu, du point de vue de l'utilisateur." },
  { name: "role", label: "Mon rôle", hint: "Ce que vous avez fait personnellement (seul ou en équipe)." },
  { name: "solution", label: "Solution", hint: "Les choix techniques et fonctionnels, et pourquoi." },
  { name: "results", label: "Résultats", hint: "Ce que le projet a produit : chiffres, retours, apprentissages." },
] as const;

type Props = {
  initial: ProjectFormValues;
  status: "draft" | "published" | null;
  isNew: boolean;
};

export function ProjectForm({ initial, status, isNew }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [intent, setIntent] = useState<"draft" | "published" | null>(null);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema), defaultValues: initial });

  // Prévient la perte de modifications non enregistrées.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  function submit(target: "draft" | "published") {
    setIntent(target);
    return handleSubmit(
      (values) =>
        startTransition(async () => {
          const result = await saveProject(values, target);
          if (!result.ok) {
            for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
              setError(path as keyof ProjectFormValues, { message });
            }
            toast(result.error, "error");
            return;
          }
          reset(values);
          toast(result.message ?? "Enregistré.");
          if (isNew) router.replace(`/admin/projets/${values.id}`);
          else router.refresh();
        }),
      () => toast("Certains champs sont à corriger (voir les messages en rouge).", "error"),
    )();
  }

  const titleField = register("title", {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!slugTouched) setValue("slug", slugify(e.target.value), { shouldValidate: false });
    },
  });
  const slugField = register("slug", { onChange: () => setSlugTouched(true) });
  const imageErrors = Array.isArray(errors.images) ? errors.images.map((e) => e?.alt?.message) : [];

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit("draft");
      }}
      className="grid grid-cols-1 gap-6 pb-28"
    >
      <Panel title="L'essentiel" description="Ce qui apparaît sur la carte du projet.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Titre" required error={errors.title?.message} className="sm:col-span-2">
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...titleField} />
            )}
          </Field>
          <Field
            label="Slug (adresse de la page)"
            required
            hint="Généré à partir du titre. Ex. /projets/mon-projet"
            error={errors.slug?.message}
          >
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={`${inputClasses} font-mono`} {...slugField} />
            )}
          </Field>
          <Field label="Période" hint="Ex. « 2026 » ou « Sept. – Oct. 2026 »" error={errors.period?.message}>
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("period")} />
            )}
          </Field>
          <Field label="Résumé" hint="Une ou deux phrases (320 caractères max)." error={errors.summary?.message} className="sm:col-span-2">
            {({ id, describedBy, invalid }) => (
              <textarea id={id} rows={3} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("summary")} />
            )}
          </Field>
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="stack"
              render={({ field, fieldState }) => (
                <TagInput
                  label="Stack technique"
                  hint="Entrée ou virgule pour ajouter (ex. Next.js, Supabase)."
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          <Field label="Lien de démo" hint="https://…" error={errors.demoUrl?.message}>
            {({ id, describedBy, invalid }) => (
              <input id={id} type="url" inputMode="url" aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("demoUrl")} />
            )}
          </Field>
          <Field label="Lien du code source" hint="https://github.com/…" error={errors.repoUrl?.message}>
            {({ id, describedBy, invalid }) => (
              <input id={id} type="url" inputMode="url" aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("repoUrl")} />
            )}
          </Field>
          <label className="flex min-h-11 items-center gap-3 sm:col-span-2">
            <input type="checkbox" className="size-5 accent-(--accent)" {...register("featured")} />
            <span>
              <span className="font-medium">Mettre en avant</span>
              <span className="block text-sm text-muted">Affiché dans « Projets choisis » sur l&apos;accueil.</span>
            </span>
          </label>
        </div>
      </Panel>

      <Panel title="Couverture" description="Image principale de la carte et de l'étude de cas (format 16:10 idéal).">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller
            control={control}
            name="coverPath"
            render={({ field }) => (
              <ImageField label="Image de couverture" path={field.value} folder={`projects/${initial.id}`} onChange={field.onChange} />
            )}
          />
          <Field label="Texte alternatif de la couverture" hint="Décrivez l'image en une phrase." error={errors.coverAlt?.message}>
            {({ id, describedBy, invalid }) => (
              <textarea id={id} rows={3} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("coverAlt")} />
            )}
          </Field>
        </div>
      </Panel>

      <Panel title="Étude de cas" description="Chaque section vide est simplement masquée sur le site.">
        <div className="grid gap-8">
          {CASE_STUDY.map((section) => (
            <Controller
              key={section.name}
              control={control}
              name={section.name}
              render={({ field, fieldState }) => (
                <RichTextEditor
                  label={section.label}
                  hint={section.hint}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          ))}
        </div>
      </Panel>

      <Panel title="Captures" description="Glissez-déposez pour ordonner. Le texte alternatif est obligatoire.">
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImagesManager value={field.value} onChange={field.onChange} folder={`projects/${initial.id}`} errors={imageErrors} />
          )}
        />
      </Panel>

      {!isNew && <DangerZone id={initial.id} title={initial.title} />}

      {/* Barre d'actions collante */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-3 sm:px-8 lg:px-12">
          <div className="mr-auto flex items-center gap-2 text-sm text-muted">
            {status && <Badge tone={status === "published" ? "success" : "neutral"}>{status === "published" ? "Publié" : "Brouillon"}</Badge>}
            {isDirty && <span>Modifications non enregistrées</span>}
          </div>
          {!isNew && (
            <Link
              href={`/admin/projets/${initial.id}/apercu`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-muted hover:bg-sunken hover:text-ink"
            >
              <Eye className="size-4" aria-hidden /> Aperçu
            </Link>
          )}
          <Button type="submit" variant="secondary" size="sm" disabled={pending}>
            {pending && intent === "draft" ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
            {status === "published" ? "Enregistrer en brouillon" : "Enregistrer le brouillon"}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => submit("published")}
            icon={pending && intent === "published" ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
          >
            {status === "published" ? "Mettre à jour" : "Publier"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function DangerZone({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  return (
    <Panel title="Zone sensible">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted">La suppression est définitive (projet, textes et images).</p>
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled={pending}
          icon={<Trash className="size-4" />}
          iconPosition="start"
          onClick={() => {
            if (!window.confirm(`Supprimer définitivement « ${title} » ?`)) return;
            startTransition(async () => {
              const result = await deleteProject(id);
              if (result.ok) {
                toast(result.message ?? "Supprimé.");
                router.replace("/admin/projets");
              } else toast(result.error, "error");
            });
          }}
        >
          Supprimer le projet
        </Button>
      </div>
    </Panel>
  );
}
