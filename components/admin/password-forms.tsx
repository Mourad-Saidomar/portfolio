"use client";

import { KeyRound, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { inputClasses } from "@/components/ui/styles";
import {
  type NewPasswordState,
  type ResetRequestState,
  requestPasswordReset,
  updatePassword,
} from "@/lib/actions/admin/auth";

const card = "mt-10 grid gap-6 rounded-(--radius-lg) border border-line bg-surface p-6 sm:p-8";

/** Demande d'e-mail de réinitialisation. Même confirmation que le compte existe ou non. */
export function ResetRequestForm({ notice }: { notice: string | null }) {
  const [state, action, pending] = useActionState<ResetRequestState, FormData>(requestPasswordReset, {
    sent: false,
    error: null,
    email: "",
  });

  if (state.sent) {
    return (
      <div role="status" className={card}>
        <Mail className="size-7 text-accent" aria-hidden />
        <p>
          Si un compte correspond à <strong>{state.email}</strong>, un e-mail vient de partir avec un lien pour choisir un
          nouveau mot de passe. Pensez à vérifier les indésirables.
        </p>
        <p className="text-sm text-muted">
          Ouvrez le lien dans ce même navigateur. Il n&apos;est valable qu&apos;une fois et pendant une durée limitée.
        </p>
        <Link href="/admin/connexion" className="link-underline w-fit text-sm">
          ← Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className={card}>
      {notice && !state.error && (
        <p role="status" className="rounded-(--radius) bg-sunken px-4 py-3 text-sm">
          {notice}
        </p>
      )}
      <Field label="E-mail du compte administrateur">
        {({ id }) => (
          <input id={id} name="email" type="email" autoComplete="username" required defaultValue={state.email} className={inputClasses} />
        )}
      </Field>
      {state.error && (
        <div role="alert">
          <FieldError>{state.error}</FieldError>
        </div>
      )}
      <Button
        type="submit"
        disabled={pending}
        icon={pending ? <LoaderCircle className="size-4 animate-spin" /> : <Mail className="size-4" />}
      >
        {pending ? "Envoi…" : "Recevoir le lien par e-mail"}
      </Button>
      <Link href="/admin/connexion" className="link-underline w-fit text-sm text-muted hover:text-ink">
        ← Retour à la connexion
      </Link>
    </form>
  );
}

/** Choix du nouveau mot de passe (session ouverte par le lien de l'e-mail). */
export function NewPasswordForm() {
  const [state, action, pending] = useActionState<NewPasswordState, FormData>(updatePassword, { error: null });

  return (
    <form action={action} className={card}>
      <Field label="Nouveau mot de passe" hint="12 caractères minimum. Une phrase de plusieurs mots est idéale.">
        {({ id, describedBy }) => (
          <input
            id={id}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
            aria-describedby={describedBy}
            className={inputClasses}
          />
        )}
      </Field>
      <Field label="Confirmer le mot de passe">
        {({ id }) => (
          <input id={id} name="confirm" type="password" autoComplete="new-password" minLength={12} required className={inputClasses} />
        )}
      </Field>
      {state.error && (
        <div role="alert">
          <FieldError>{state.error}</FieldError>
        </div>
      )}
      <Button
        type="submit"
        disabled={pending}
        icon={pending ? <LoaderCircle className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
      >
        {pending ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </Button>
    </form>
  );
}
