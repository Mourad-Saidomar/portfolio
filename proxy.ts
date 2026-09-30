import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/connexion";

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
  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;

  if (!data?.claims && !isLoginPage) {
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
