import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ResetRequestForm } from "@/components/admin/password-forms";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage({ searchParams }: PageProps<"/admin/mot-de-passe-oublie">) {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-[1.375rem]">
          Mourad Saidomar
        </Link>
        <h1 className="mt-10 font-display text-h2">Mot de passe oublié</h1>
        <p className="mt-3 text-muted">Recevez par e-mail un lien pour choisir un nouveau mot de passe.</p>
        <Suspense fallback={<div className="mt-10 h-64 rounded-(--radius-lg) bg-sunken" />}>
          <Panel searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function Panel({ searchParams }: Pick<PageProps<"/admin/mot-de-passe-oublie">, "searchParams">) {
  const params = await searchParams;
  const expired = params.erreur === "lien";
  return <ResetRequestForm notice={expired ? "Ce lien a expiré ou a déjà servi. Demandez-en un nouveau." : null} />;
}
