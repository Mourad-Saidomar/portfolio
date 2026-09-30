import "server-only";
import type { z } from "zod";
import { type AdminSession, UnauthorizedError, assertAdmin } from "@/lib/auth";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Enveloppe commune des Server Actions admin :
 * autorisation (session + rôle) → exécution → erreurs converties en messages lisibles.
 */
export async function runAdminAction<T>(
  task: (session: AdminSession) => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  try {
    const session = await assertAdmin();
    return await task(session);
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, error: error.message };
    console.error("[admin]", error);
    return { ok: false, error: "Une erreur inattendue est survenue. Réessayez." };
  }
}

/** Erreurs Zod → { champ: message } (premier message par champ, chemins pointés). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}

export function invalid(error: z.ZodError): ActionResult<never> {
  return { ok: false, error: "Certains champs sont à corriger.", fieldErrors: fieldErrors(error) };
}

export function dbError(scope: string, error: { message: string; code?: string }): ActionResult<never> {
  console.error(`[admin] ${scope} : ${error.message}`);
  return { ok: false, error: `Échec de l'enregistrement (${scope}). Réessayez.` };
}
