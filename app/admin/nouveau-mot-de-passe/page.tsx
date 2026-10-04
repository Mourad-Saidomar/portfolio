import type { Metadata } from "next";
import Link from "next/link";
import { NewPasswordForm } from "@/components/admin/password-forms";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

/**
 * Atteinte via le lien de l'e-mail (session temporaire ouverte par /admin/auth/confirm).
 * Sans session, le proxy renvoie vers la connexion ; l'action vérifie aussi le rôle admin.
 */
export default function NewPasswordPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-[1.375rem]">
          Mourad Saidomar
        </Link>
        <h1 className="mt-10 font-display text-h2">Nouveau mot de passe</h1>
        <p className="mt-3 text-muted">Choisissez votre nouveau mot de passe d&apos;administration.</p>
        <NewPasswordForm />
      </div>
    </main>
  );
}
