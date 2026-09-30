"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { isDemoMode } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/service";
import { CONTACT_LIMITS, contactSchema, type ContactResult } from "@/lib/validation/contact";

function hashIp(ip: string): string {
  const salt = process.env.CONTACT_RATE_LIMIT_SALT ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "portfolio";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Enregistre un message de contact.
 * Défenses : validation Zod, honeypot, délai minimal de saisie, limitation de débit par IP hachée.
 * Les robots détectés reçoivent une réponse de succès (sans enregistrement) pour ne pas les renseigner.
 */
export async function sendContactMessage(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    if (flat.website || flat.startedAt) return { ok: true };
    return {
      ok: false,
      error: "Certains champs sont à corriger.",
      fieldErrors: { name: flat.name?.[0], email: flat.email?.[0], message: flat.message?.[0] },
    };
  }

  const { name, email, message, website, startedAt } = parsed.data;
  if (website || Date.now() - startedAt < CONTACT_LIMITS.minFillMs) return { ok: true };

  if (isDemoMode()) {
    console.info(`[contact] (démo, non enregistré) ${name} <${email}>`);
    return { ok: true };
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false, error: "Le formulaire est momentanément indisponible. Écrivez-moi directement par e-mail." };
  }

  const ipHash = hashIp(await clientIp());
  const since = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
  const [recent, daily] = await Promise.all([
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since(CONTACT_LIMITS.windowMinutes)),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since(24 * 60)),
  ]);

  if ((recent.count ?? 0) >= CONTACT_LIMITS.perWindow || (daily.count ?? 0) >= CONTACT_LIMITS.perDay) {
    return {
      ok: false,
      error: `Vous avez déjà envoyé plusieurs messages. Réessayez dans ${CONTACT_LIMITS.windowMinutes} minutes ou écrivez-moi par e-mail.`,
    };
  }

  const { error } = await supabase.from("messages").insert({ name, email, message, ip_hash: ipHash });
  if (error) {
    console.error(`[contact] ${error.message}`);
    return { ok: false, error: "L'envoi a échoué. Réessayez dans un instant ou écrivez-moi par e-mail." };
  }
  return { ok: true };
}
