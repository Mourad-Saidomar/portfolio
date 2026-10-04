"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { env, isSupabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Adresse e-mail invalide.")),
  password: z.string().min(1, "Mot de passe obligatoire.").max(200),
});

export type LoginState = { error: string | null; email: string };

/** N'accepte que des chemins internes à /admin (évite les redirections ouvertes). */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return /^\/admin(\/[\w\-/]*)?$/.test(next) && !next.startsWith("/admin/connexion") ? next : "/admin";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  if (!isSupabaseConfigured()) {
    return { error: "Supabase n'est pas configuré : renseignez les variables d'environnement (voir README).", email };
  }

  const parsed = loginSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) return { error: "Renseignez une adresse e-mail valide et votre mot de passe.", email };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Message volontairement générique : ne révèle pas si le compte existe.
  if (error) return { error: "Identifiants incorrects ou compte temporairement bloqué.", email };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Ce compte n'a pas accès à l'administration.", email };
  }

  redirect(safeNext(formData.get("suite")));
}

// ─── Mot de passe oublié ────────────────────────────────────────────

export type ResetRequestState = { sent: boolean; error: string | null; email: string };

/**
 * Envoie l'e-mail de réinitialisation (lien Supabase à usage unique).
 * Réponse identique que le compte existe ou non : ne révèle pas les adresses enregistrées.
 */
export async function requestPasswordReset(_prev: ResetRequestState, formData: FormData): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!isSupabaseConfigured()) {
    return { sent: false, error: "Supabase n'est pas configuré (voir README).", email };
  }
  if (!z.email().safeParse(email).success) {
    return { sent: false, error: "Adresse e-mail invalide.", email };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.siteUrl}/admin/auth/confirm?suite=/admin/nouveau-mot-de-passe`,
  });
  // Seule la limite d'envoi de Supabase est signalée ; les autres erreurs restent silencieuses.
  if (error?.status === 429) {
    return { sent: false, error: "Trop de demandes. Réessayez dans quelques minutes.", email };
  }
  if (error) console.error(`[admin] réinitialisation : ${error.message}`);
  return { sent: true, error: null, email };
}

const newPasswordSchema = z
  .object({
    password: z.string().min(12, "12 caractères minimum.").max(200, "200 caractères maximum."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Les deux mots de passe ne correspondent pas." });

export type NewPasswordState = { error: string | null };

/** Enregistre le nouveau mot de passe (session ouverte par le lien de l'e-mail, admin uniquement). */
export async function updatePassword(_prev: NewPasswordState, formData: FormData): Promise<NewPasswordState> {
  const parsed = newPasswordSchema.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Mot de passe invalide." };

  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!data?.claims || !isAdmin) {
    return { error: "Lien expiré ou déjà utilisé. Demandez un nouvel e-mail de réinitialisation." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") return { error: "Choisissez un mot de passe différent de l'ancien." };
    if (error.code === "weak_password") return { error: "Mot de passe trop faible : allongez-le ou variez les caractères." };
    console.error(`[admin] nouveau mot de passe : ${error.message}`);
    return { error: "L'enregistrement a échoué. Réessayez." };
  }
  redirect("/admin?mdp=modifie");
}

export async function logout(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/connexion");
}
