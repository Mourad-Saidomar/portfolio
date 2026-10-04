"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { inputClasses } from "@/components/ui/styles";
import { deleteTestimonial, saveTestimonial } from "@/lib/actions/admin/content";
import { type TestimonialFormValues, testimonialSchema } from "@/lib/validation/admin";
import { useToast } from "./toaster";
import { Panel } from "./ui";

export function TestimonialForm({ initial }: { initial: TestimonialFormValues }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TestimonialFormValues>({ resolver: zodResolver(testimonialSchema), defaultValues: initial });

  const onSubmit = handleSubmit(
    (values) =>
      startTransition(async () => {
        const result = await saveTestimonial(values);
        if (!result.ok) {
          for (const [path, message] of Object.entries(result.fieldErrors ?? {})) {
            setError(path as keyof TestimonialFormValues, { message });
          }
          toast(result.error, "error");
          return;
        }
        toast(result.message ?? "Enregistré.");
        router.push("/admin/avis");
        router.refresh();
      }),
    () => toast("Certains champs sont à corriger.", "error"),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-6">
      <Panel>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Citation"
            required
            hint="Les mots exacts de la personne, sans guillemets (600 caractères maximum)."
            error={errors.quote?.message}
            className="sm:col-span-2"
          >
            {({ id, describedBy, invalid }) => (
              <textarea id={id} rows={5} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("quote")} />
            )}
          </Field>
          <Field label="Nom" required error={errors.authorName?.message}>
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("authorName")} />
            )}
          </Field>
          <Field label="Rôle" hint="Ex. tuteur de stage, formateur, coéquipier…" error={errors.authorRole?.message}>
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("authorRole")} />
            )}
          </Field>
          <Field label="Structure" hint="Entreprise, administration, école…" error={errors.organization?.message} className="sm:col-span-2">
            {({ id, describedBy, invalid }) => (
              <input id={id} aria-describedby={describedBy} aria-invalid={invalid} className={inputClasses} {...register("organization")} />
            )}
          </Field>
          <label className="flex min-h-11 items-center gap-3 sm:col-span-2">
            <input type="checkbox" className="size-5 accent-(--accent)" {...register("published")} />
            <span>
              <span className="font-medium">Visible sur le site</span>
              <span className="block text-sm text-muted">Décochez pour garder l&apos;avis en réserve.</span>
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
              if (!initial.id || !window.confirm("Supprimer définitivement cet avis ?")) return;
              const id = initial.id;
              startTransition(async () => {
                const result = await deleteTestimonial(id);
                if (!result.ok) return toast(result.error, "error");
                toast(result.message ?? "Supprimé.");
                router.push("/admin/avis");
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
