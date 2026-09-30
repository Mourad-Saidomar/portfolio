"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
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

export async function logout(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/connexion");
}
