/**
 * Accès centralisé aux variables d'environnement.
 * Les valeurs publiques sont lues explicitement pour que Next.js puisse les inliner côté client.
 */

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};

/** Supabase est-il configuré ? Sans lui, le site affiche des états vides (ou le mode démo). */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

/** Mode démo : lecture du contenu de seed, uniquement si explicitement demandé. */
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "1" || process.env.DEMO_MODE === "true";
}
