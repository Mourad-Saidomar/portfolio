"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, type FieldPath, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { inputClasses } from "@/components/ui/styles";
import { saveProfile } from "@/lib/actions/admin/content";
import { type ProfileFormValues, profileSchema } from "@/lib/validation/admin";
import { ImageField } from "./image-field";
import { TagInput } from "./tag-input";
import { useToast } from "./toaster";
import { Panel } from "./ui";

export function ProfileForm({ initial }: { initial: ProfileFormValues }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const form = useForm<ProfileFormValues>({ resolver: zodResolver(profileSchema), defaultValues: initial });
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = form;

  const onSubmit = handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await saveProfile(values);
        if (!result.ok) {
          for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
            setError(path as FieldPath<ProfileFormValues>, { message });
          }
          toast(result.error, "error");
          return;
        }
        reset(values);
        toast(result.message ?? "Enregistré.");
        router.refresh();
      }),
    () => toast("Certains champs sont à corriger.", "error"),
  );

  const text = (name: FieldPath<ProfileFormValues>, label: string, options: { hint?: string; rows?: number; type?: string; required?: boolean; className?: string } = {}) => {
    const error = name.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown> | undefined)?.[key], errors) as
      | { message?: string }
      | undefined;
    return (
      <Field label={label} hint={options.hint} required={options.required} error={error?.message} className={options.className}>
        {({ id, describedBy, invalid }) =>
          options.rows ? (
            <textarea id={id} rows={options.rows} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register(name)} />
          ) : (
            <input id={id} type={options.type ?? "text"} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register(name)} />
          )
        }
      </Field>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-6 pb-28">
      <Panel id="identite" title="Identité et accroche" description="Le haut de la page d'accueil : ce qu'un recruteur lit en premier.">
        <div className="grid gap-5 sm:grid-cols-2">
          {text("fullName", "Nom complet", { required: true })}
          {text("headline", "Métier affiché", { required: true, hint: "Ex. Développeur web & web mobile" })}
          {text("tagline", "Proposition de valeur", { required: true, rows: 2, hint: "Une phrase : ce que vous apportez. Entourez de [crochets] les mots à mettre en valeur.", className: "sm:col-span-2" })}
          {text("intro", "Sous-titre", { rows: 3, className: "sm:col-span-2" })}
          {text("availability", "Disponibilité", { hint: "Ex. Disponible pour un stage à partir de janvier 2027" })}
          {text("location", "Localisation")}
        </div>
      </Panel>

      <Panel id="bio" title="Présentation" description="Page « À propos ». Séparez les paragraphes par une ligne vide.">
        {text("bio", "Biographie", { rows: 10 })}
      </Panel>

      <Panel id="photo" title="Photo">
        <div className="grid gap-5 md:grid-cols-2">
          <Controller
            control={control}
            name="photoPath"
            render={({ field }) => (
              <ImageField label="Portrait" path={field.value} folder="profile" onChange={field.onChange} aspect="aspect-[4/5] max-w-60" />
            )}
          />
          {text("photoAlt", "Texte alternatif de la photo", { rows: 3, hint: "Ex. Portrait de Mourad Saidomar, souriant" })}
        </div>
      </Panel>

      <Panel id="liens" title="Contact et liens">
        <div className="grid gap-5 sm:grid-cols-2">
          {text("email", "E-mail public", { type: "email", required: true })}
          {text("phone", "Téléphone")}
          <label className="flex min-h-11 items-center gap-3 sm:col-span-2">
            <input type="checkbox" className="size-5 accent-(--accent)" {...register("showPhone")} />
            <span className="font-medium">Afficher le téléphone sur la page Contact</span>
          </label>
          {text("linkedinUrl", "LinkedIn", { type: "url", hint: "https://www.linkedin.com/in/…" })}
          {text("githubUrl", "GitHub", { type: "url", hint: "https://github.com/…" })}
          {text("websiteUrl", "Autre site", { type: "url" })}
        </div>
      </Panel>

      <TitledList form={form} name="values" title="Valeurs" max={6} />
      <TitledList form={form} name="differentiators" title="Ce qui me distingue" max={6} />
      <LanguagesList form={form} />

      <Panel id="interets" title="Centres d'intérêt">
        <Controller
          control={control}
          name="interests"
          render={({ field, fieldState }) => (
            <TagInput label="Centres d'intérêt" value={field.value} onChange={field.onChange} error={fieldState.error?.message} max={12} />
          )}
        />
      </Panel>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3 px-5 py-3 sm:px-8 lg:px-12">
          {isDirty && <span className="mr-auto text-sm text-muted">Modifications non enregistrées</span>}
          <Button
            type="submit"
            size="sm"
            disabled={pending}
            icon={pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            iconPosition="start"
          >
            Enregistrer et publier
          </Button>
        </div>
      </div>
    </form>
  );
}

type FormApi = ReturnType<typeof useForm<ProfileFormValues>>;

function TitledList({ form, name, title, max }: { form: FormApi; name: "values" | "differentiators"; title: string; max: number }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name });
  const errors = form.formState.errors[name];
  return (
    <Panel id={name} title={title}>
      <ol className="grid gap-4">
        {fields.map((field, index) => (
          <li key={field.id} className="grid gap-3 rounded-(--radius) border border-line bg-bg p-4 sm:grid-cols-[1fr_2fr_auto]">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Titre {index + 1}</span>
              <input className={`${inputClasses} py-2`} aria-invalid={Boolean(errors?.[index]?.title)} {...form.register(`${name}.${index}.title`)} />
              {errors?.[index]?.title && <span className="text-danger">{errors[index]?.title?.message}</span>}
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Description</span>
              <textarea rows={2} className={`${inputClasses} py-2`} aria-invalid={Boolean(errors?.[index]?.description)} {...form.register(`${name}.${index}.description`)} />
              {errors?.[index]?.description && <span className="text-danger">{errors[index]?.description?.message}</span>}
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              className="inline-flex size-11 items-center justify-center self-end rounded-full text-muted hover:bg-sunken hover:text-danger"
              aria-label={`Retirer l'élément ${index + 1} de « ${title} »`}
            >
              <Trash className="size-4" aria-hidden />
            </button>
          </li>
        ))}
      </ol>
      {fields.length < max && (
        <Button type="button" variant="ghost" size="sm" className="mt-3" icon={<Plus className="size-4" />} iconPosition="start" onClick={() => append({ title: "", description: "" })}>
          Ajouter
        </Button>
      )}
    </Panel>
  );
}

function LanguagesList({ form }: { form: FormApi }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "languages" });
  return (
    <Panel id="langues" title="Langues">
      <ol className="grid gap-3">
        {fields.map((field, index) => (
          <li key={field.id} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Langue {index + 1}</span>
              <input className={`${inputClasses} py-2`} {...form.register(`languages.${index}.name`)} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Niveau</span>
              <input className={`${inputClasses} py-2`} {...form.register(`languages.${index}.level`)} />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-sunken hover:text-danger"
              aria-label={`Retirer la langue ${index + 1}`}
            >
              <Trash className="size-4" aria-hidden />
            </button>
          </li>
        ))}
      </ol>
      {fields.length < 8 && (
        <Button type="button" variant="ghost" size="sm" className="mt-3" icon={<Plus className="size-4" />} iconPosition="start" onClick={() => append({ name: "", level: "" })}>
          Ajouter une langue
        </Button>
      )}
    </Panel>
  );
}
