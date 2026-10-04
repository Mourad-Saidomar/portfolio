"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { inputClasses } from "@/components/ui/styles";
import { type LoginState, login } from "@/lib/actions/admin/auth";

export function LoginForm({ next, notice }: { next: string; notice: string | null }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null, email: "" });

  return (
    <form action={action} className="mt-10 grid gap-6 rounded-(--radius-lg) border border-line bg-surface p-6 sm:p-8">
      <input type="hidden" name="suite" value={next} />
      {notice && !state.error && (
        <p role="status" className="rounded-(--radius) bg-sunken px-4 py-3 text-sm">
          {notice}
        </p>
      )}
      <Field label="E-mail">
        {({ id }) => (
          <input
            id={id}
            name="email"
            type="email"
            autoComplete="username"
            required
            defaultValue={state.email}
            className={inputClasses}
          />
        )}
      </Field>
      <Field label="Mot de passe">
        {({ id }) => (
          <input
            id={id}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClasses}
          />
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
        icon={pending ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
      >
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
      <Link href="/admin/mot-de-passe-oublie" className="link-underline w-fit text-sm text-muted hover:text-ink">
        Mot de passe oublié ?
      </Link>
    </form>
  );
}
