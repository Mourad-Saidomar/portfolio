import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";

/** Seules ces pages internes peuvent suivre la confirmation (évite les redirections ouvertes). */
const ALLOWED_NEXT = new Set(["/admin", "/admin/nouveau-mot-de-passe"]);

/**
 * Lien de l'e-mail « mot de passe oublié » : ouvre une session temporaire, puis renvoie
 * vers la page du nouveau mot de passe. Deux formats de lien sont acceptés :
 *  - `token_hash` + `type` (modèle d'e-mail personnalisé : fonctionne sur n'importe quel appareil) ;
 *  - `code` (modèle par défaut de Supabase : à ouvrir dans le navigateur qui a fait la demande).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const suite = searchParams.get("suite") ?? "";
  const next = ALLOWED_NEXT.has(suite) ? suite : "/admin/nouveau-mot-de-passe";

  const supabase = await createSessionClient();
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  let ok = false;
  if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  const target = request.nextUrl.clone();
  target.search = "";
  if (ok) {
    target.pathname = next;
  } else {
    target.pathname = "/admin/mot-de-passe-oublie";
    target.searchParams.set("erreur", "lien");
  }
  return NextResponse.redirect(target);
}
