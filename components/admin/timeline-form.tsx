"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { inputClasses } from "@/components/ui/styles";
import { deleteTimelineEntry, saveTimelineEntry } from "@/lib/actions/admin/content";
import { type TimelineFormValues, timelineSchema } from "@/lib/validation/admin";
import { TagInput } from "./tag-input";
import { useToast } from "./toaster";
import { Panel } from "./ui";

export function TimelineForm({ initial }: { initial: TimelineFormValues }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TimelineFormValues>({ resolver: zodResolver(timelineSchema), defaultValues: initial });
  const isCurrent = useWatch({ control, name: "isCurrent" });

  const onSubmit = handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await saveTimelineEntry(values);
        if (!result.ok) {
          for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
            setError(path as keyof TimelineFormValues, { message });
          }
          toast(result.error, "error");
          return;
        }
        toast(result.message ?? "Enregistré.");
        router.push("/admin/parcours");
        router.refresh();
      }),
    () => toast("Certains champs sont à corriger.", "error"),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-6">
      <Panel>
        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium">Type d&apos;étape</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { value: "experience", label: "Expérience" },
                { value: "education", label: "Formation" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-field px-4 has-checked:border-ink has-checked:bg-ink has-checked:text-bg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
                >
                  <input type="radio" value={option.value} className="sr-only" {...register("kind")} />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Intitulé" required error={errors.title?.message} className="sm:col-span-2">
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("title")} />
            )}
          </Field>
          <Field label="Structure" required hint="Entreprise, école, organisme…" error={errors.organization?.message}>
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("organization")} />
            )}
          </Field>
          <Field label="Lieu" error={errors.location?.message}>
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("location")} />
            )}
          </Field>
          <Field label="Début" hint="Laissez vide si inconnu." error={errors.startDate?.message}>
            {({ id, describedBy, invalid }) => (
              <input id={id} type="month" aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("startDate")} />
            )}
          </Field>
          {isCurrent ? (
            <p className="self-end pb-3 text-sm text-muted">Étape en cours : pas de date de fin.</p>
          ) : (
            <Field label="Fin" error={errors.endDate?.message}>
              {({ id, describedBy, invalid }) => (
                <input id={id} type="month" aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("endDate")} />
              )}
            </Field>
          )}
          <label className="flex min-h-11 items-center gap-3">
            <input type="checkbox" className="size-5 accent-(--accent)" {...register("isCurrent")} />
            <span className="font-medium">En cours</span>
          </label>
          <Field label="Affichage des dates" error={errors.datePrecision?.message}>
            {({ id, describedBy }) => (
              <select id={id} aria-describedby={describedBy} className={inputClasses} {...register("datePrecision")}>
                <option value="month">Mois et année (janv. 2024)</option>
                <option value="year">Année seule (2024)</option>
              </select>
            )}
          </Field>
          <Field label="Description" error={errors.description?.message} className="sm:col-span-2">
            {({ id, describedBy, invalid }) => (
              <textarea id={id} rows={3} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("description")} />
            )}
          </Field>
          <div className="sm:col-span-2">
            <Controller
              control={control}
              name="highlights"
              render={({ field, fieldState }) => (
                <TagInput
                  label="Points clés"
                  hint="Missions ou acquis, un par entrée (Entrée pour valider)."
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  max={12}
                />
              )}
            />
          </div>
          <label className="flex min-h-11 items-center gap-3 sm:col-span-2">
            <input type="checkbox" className="size-5 accent-(--accent)" {...register("published")} />
            <span>
              <span className="font-medium">Visible sur le site</span>
              <span className="block text-sm text-muted">Décochez pour garder l&apos;étape en réserve.</span>
            </span>
          </label>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {initial.id ? (
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={pending}
            icon={<Trash className="size-4" />}
            iconPosition="start"
            onClick={() => {
              if (!initial.id || !window.confirm("Supprimer définitivement cette étape ?")) return;
              const id = initial.id;
              startTransition(async () => {
                const result = await deleteTimelineEntry(id);
                if (!result.ok) return toast(result.error, "error");
                toast(result.message ?? "Supprimé.");
                router.push("/admin/parcours");
                router.refresh();
              });
            }}
          >
            Supprimer
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="submit"
          disabled={pending}
          icon={pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          iconPosition="start"
        >
          Enregistrer et publier
        </Button>
      </div>
    </form>
  );
}
