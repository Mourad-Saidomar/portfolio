import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { isDemoMode, isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage({ searchParams }: PageProps<"/admin/connexion">) {
  const configured = isSupabaseConfigured() && !isDemoMode();

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-[1.375rem]">
          Mourad Saidomar
        </Link>
        <h1 className="mt-10 font-display text-h2">Administration</h1>
        <p className="mt-3 text-muted">Espace réservé à la mise à jour du portfolio.</p>

        {configured ? (
          <Suspense fallback={<div className="mt-10 h-72 rounded-(--radius-lg) bg-sunken" />}>
            <LoginPanel searchParams={searchParams} />
          </Suspense>
        ) : (
          <div role="status" className="mt-10 rounded-(--radius-lg) border border-line bg-surface p-6">
            <p className="font-medium">Administration indisponible</p>
            <p className="mt-2 text-muted">
              {isDemoMode()
                ? "Le site tourne en mode démo (DEMO_MODE=1) : le contenu est en lecture seule."
                : "Supabase n'est pas configuré. Renseignez les variables d'environnement décrites dans le README."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

async function LoginPanel({ searchParams }: Pick<PageProps<"/admin/connexion">, "searchParams">) {
  const params = await searchParams;
  const next = typeof params.suite === "string" ? params.suite : "/admin";
  const denied = params.erreur === "acces";
  return <LoginForm next={next} notice={denied ? "Votre session a expiré ou n'a pas accès à l'administration." : null} />;
}
