// zod/mini : même moteur que zod, mais « tree-shakable » (quelques Ko dans le bundle public
// au lieu de la bibliothèque complète). Le schéma est partagé client/serveur.
import * as z from "zod/mini";

/** Schéma partagé client/serveur du formulaire de contact. */
export const contactSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(2, "Indiquez votre nom (2 caractères minimum)."),
      z.maxLength(120, "120 caractères maximum."),
    ),
  email: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "Indiquez votre adresse e-mail."),
      z.maxLength(254, "Adresse e-mail trop longue."),
      z.regex(z.regexes.email, "Adresse e-mail invalide, par exemple : nom@entreprise.fr."),
    ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(10, "Votre message est un peu court (10 caractères minimum)."),
      z.maxLength(5000, "5 000 caractères maximum."),
    ),
  /** Honeypot : invisible pour les humains, doit rester vide. */
  website: z.optional(z.string().check(z.maxLength(0))),
  /** Horodatage d'affichage du formulaire (ms) : les robots soumettent en moins de 3 s. */
  startedAt: z.int().check(z.positive()),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const CONTACT_LIMITS = {
  minFillMs: 3000,
  perWindow: 3,
  windowMinutes: 10,
  perDay: 10,
} as const;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<"name" | "email" | "message", string>> };
