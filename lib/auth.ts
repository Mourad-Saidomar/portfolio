import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";

export type AdminSession = {
  supabase: Awaited<ReturnType<typeof createSessionClient>>;
  userId: string;
  email: string | null;
};

/** Vérifie la session et le rôle admin (JWT vérifié + table admins). Null si refusé. */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;

  return { supabase, userId: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
}

/** Pour les pages admin : redirige vers la connexion si la session n'est pas celle de l'admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/connexion?erreur=acces");
  return session;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Session expirée ou accès refusé. Reconnectez-vous.");
  }
}

/** Pour les Server Actions : lève une erreur (convertie en message) si l'appelant n'est pas l'admin. */
export async function assertAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
