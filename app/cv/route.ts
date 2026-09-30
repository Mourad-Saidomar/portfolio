import { getProfile } from "@/lib/data/public";

/**
 * Lien stable vers le CV à jour (/cv) : redirige vers le dernier PDF téléversé dans l'admin.
 * Utilisable sur un CV papier, une signature d'e-mail ou LinkedIn.
 */
export async function GET(request: Request) {
  const profile = await getProfile();
  if (!profile?.cvUrl) {
    return new Response("CV bientôt disponible.", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return Response.redirect(new URL(profile.cvUrl, request.url), 307);
}
