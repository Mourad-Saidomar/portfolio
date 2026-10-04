import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/connexion";
/** Pages admin accessibles sans session : connexion, mot de passe oublié, lien de l'e-mail. */
const PUBLIC_PATHS = new Set([LOGIN_PATH, "/admin/mot-de-passe-oublie", "/admin/auth/confirm"]);

/**
 * Protège /admin : rafraîchit la session Supabase (cookies) et redirige les visiteurs
 * non connectés vers la page de connexion. L'autorisation fine (rôle admin) est
 * vérifiée côté serveur dans chaque page et chaque Server Action, puis par la RLS.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [header, value] of Object.entries(headers ?? {})) response.headers.set(header, value);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isPublic = PUBLIC_PATHS.has(request.nextUrl.pathname);

  if (!data?.claims && !isPublic) {
    const target = request.nextUrl.clone();
    target.pathname = LOGIN_PATH;
    target.search = "";
    target.searchParams.set("suite", request.nextUrl.pathname);
    const redirect = NextResponse.redirect(target);
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
