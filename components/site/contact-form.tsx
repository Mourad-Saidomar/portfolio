"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { inputClasses } from "@/components/ui/styles";
import { sendContactMessage } from "@/lib/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";

export function ContactForm({ email }: { email: string | null }) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "", startedAt: 0 },
    shouldFocusError: true,
  });

  // Horodatage posé après hydratation (anti-robot), jamais pendant le rendu serveur.
  useEffect(() => {
    setValue("startedAt", Date.now());
  }, [setValue]);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (serverError) errorRef.current?.focus();
  }, [serverError]);

  async function submit(values: ContactInput) {
    setServerError(null);
    const result = await sendContactMessage(values);
    if (result.ok) {
      reset({ name: "", email: "", message: "", website: "", startedAt: values.startedAt });
      setStatus("sent");
      return;
    }
    const fields = Object.entries(result.fieldErrors ?? {}).filter(([, msg]) => msg) as [
      "name" | "email" | "message",
      string,
    ][];
    for (const [field, message] of fields) setError(field, { message });
    if (fields[0]) setFocus(fields[0][0]);
    else {
      setServerError(result.error);
    }
  }

  if (status === "sent") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-(--radius-lg) border border-line bg-surface p-8 outline-none md:p-10"
      >
        <CircleCheck className="size-8 text-success" aria-hidden />
        <h2 className="mt-5 font-display text-h3">Message envoyé, merci !</h2>
        <p className="mt-3 text-muted">Je vous réponds en général sous 48 heures, à l&apos;adresse indiquée.</p>
        <Button variant="secondary" size="sm" className="mt-8" onClick={() => setStatus("idle")}>
          Écrire un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate aria-describedby="contact-required" className="grid gap-6">
      <p id="contact-required" className="text-sm text-muted">
        Tous les champs sont obligatoires.
      </p>

      <Field label="Nom" error={errors.name?.message}>
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            type="text"
            autoComplete="name"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={inputClasses}
            {...register("name")}
          />
        )}
      </Field>

      <Field label="E-mail" error={errors.email?.message} hint="Pour que je puisse vous répondre.">
        {({ id, describedBy, invalid }) => (
          <input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={inputClasses}
            {...register("email")}
          />
        )}
      </Field>

      <Field label="Message" error={errors.message?.message}>
        {({ id, describedBy, invalid }) => (
          <textarea
            id={id}
            rows={6}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={`${inputClasses} min-h-40 resize-y`}
            {...register("message")}
          />
        )}
      </Field>

      {/* Honeypot : hors écran, ignoré par les humains et les technologies d'assistance. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-website">Site web</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {serverError && (
        <div ref={errorRef} tabIndex={-1} role="alert" className="outline-none">
          <FieldError>
            {serverError}
            {email && (
              <>
                {" "}
                <a href={`mailto:${email}`} className="underline underline-offset-2">
                  {email}
                </a>
              </>
            )}
          </FieldError>
        </div>
      )}

      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
        >
          {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
        </Button>
      </div>
    </form>
  );
}
