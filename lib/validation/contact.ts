import { z } from "zod";

/** Schéma partagé client/serveur du formulaire de contact. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom (2 caractères minimum).").max(120, "120 caractères maximum."),
  email: z
    .string()
    .trim()
    .min(1, "Indiquez votre adresse e-mail.")
    .max(254, "Adresse e-mail trop longue.")
    .pipe(z.email("Adresse e-mail invalide, par exemple : nom@entreprise.fr.")),
  message: z
    .string()
    .trim()
    .min(10, "Votre message est un peu court (10 caractères minimum).")
    .max(5000, "5 000 caractères maximum."),
  /** Honeypot : invisible pour les humains, doit rester vide. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Horodatage d'affichage du formulaire (ms) : les robots soumettent en moins de 3 s. */
  startedAt: z.number().int().positive(),
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
