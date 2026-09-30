// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
const counts = { recent: 0, daily: 0 };

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }),
}));
vi.mock("@/lib/supabase/service", () => ({
  createServiceClient: () => ({
    from: () => ({
      select: () => {
        let call = 0;
        const chain = {
          eq: () => chain,
          gte: (_col: string, since: string) => {
            call += 1;
            const window = Date.now() - new Date(since).getTime();
            return Promise.resolve({ count: window > 60 * 60_000 ? counts.daily : counts.recent, call });
          },
        };
        return chain;
      },
      insert: (row: unknown) => {
        insert(row);
        return Promise.resolve({ error: null });
      },
    }),
  }),
}));

const { sendContactMessage } = await import("@/lib/actions/contact");

const valid = () => ({
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Bonjour, avez-vous un moment pour échanger ?",
  website: "",
  startedAt: Date.now() - 10_000,
});

describe("sendContactMessage", () => {
  beforeEach(() => {
    insert.mockClear();
    counts.recent = 0;
    counts.daily = 0;
    vi.stubEnv("DEMO_MODE", "");
  });

  it("enregistre un message valide avec une IP hachée (jamais en clair)", async () => {
    expect(await sendContactMessage(valid())).toEqual({ ok: true });
    expect(insert).toHaveBeenCalledOnce();
    const row = insert.mock.calls[0]?.[0] as { ip_hash: string };
    expect(row.ip_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(row)).not.toContain("203.0.113.7");
  });

  it("répond « succès » au robot qui remplit le honeypot, sans rien enregistrer", async () => {
    expect(await sendContactMessage({ ...valid(), website: "http://spam.example" })).toEqual({ ok: true });
    expect(insert).not.toHaveBeenCalled();
  });

  it("ignore les soumissions trop rapides", async () => {
    expect(await sendContactMessage({ ...valid(), startedAt: Date.now() - 500 })).toEqual({ ok: true });
    expect(insert).not.toHaveBeenCalled();
  });

  it("renvoie les erreurs de champ", async () => {
    const result = await sendContactMessage({ ...valid(), email: "nope" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors?.email).toMatch(/invalide/);
  });

  it("limite le débit par IP", async () => {
    counts.recent = 3;
    const result = await sendContactMessage(valid());
    expect(result.ok).toBe(false);
    expect(insert).not.toHaveBeenCalled();
  });

  it("n'enregistre rien en mode démo", async () => {
    vi.stubEnv("DEMO_MODE", "1");
    expect(await sendContactMessage(valid())).toEqual({ ok: true });
    expect(insert).not.toHaveBeenCalled();
  });
});
