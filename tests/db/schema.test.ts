// @vitest-environment node
import type { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";
import { buildSeedRows } from "@/supabase/seed/rows";
import { as, createDatabase, insertRows, sqlError } from "./harness";

const DRAFT_ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
let db: PGlite;

beforeAll(async () => {
  db = await createDatabase();
  const rows = buildSeedRows();
  await insertRows(db, "profile", [rows.profile]);
  await insertRows(db, "timeline_entries", rows.timeline);
  await insertRows(db, "skill_categories", rows.skillCategories);
  await insertRows(db, "skills", rows.skills);
  await insertRows(db, "projects", rows.projects);
  await insertRows(db, "project_images", rows.projectImages);
  // Un brouillon, pour vérifier qu'il reste invisible du public.
  await insertRows(db, "projects", [{ id: DRAFT_ID, slug: "brouillon", title: "Brouillon", status: "draft" }]);
  await insertRows(db, "project_images", [{ project_id: DRAFT_ID, path: "draft.webp" }]);
  await insertRows(db, "messages", [{ name: "Ada", email: "ada@example.com", message: "Bonjour" }]);
}, 60_000);

describe("seed", () => {
  it("insère tout le contenu de CONTENT.md", async () => {
    const { rows } = await db.query<{ t: string; n: number }>(`
      select 'projects' t, count(*)::int n from public.projects
      union all select 'timeline', count(*)::int from public.timeline_entries
      union all select 'skills', count(*)::int from public.skills
      union all select 'images', count(*)::int from public.project_images`);
    const byTable = Object.fromEntries(rows.map((r) => [r.t, r.n]));
    expect(byTable.projects).toBe(6);
    expect(byTable.timeline).toBe(10);
    expect(byTable.skills).toBeGreaterThan(20);
    expect(byTable.images).toBe(5);
  });

  it("horodate la publication des projets publiés", async () => {
    const { rows } = await db.query<{ n: number }>(
      "select count(*)::int n from public.projects where status = 'published' and published_at is null",
    );
    expect(rows[0]?.n).toBe(0);
  });
});

describe("RLS — visiteur anonyme", () => {
  it("ne voit que les projets publiés", async () => {
    const slugs = await as(db, "anon", async (tx) =>
      (await tx.query<{ slug: string }>("select slug from public.projects")).rows.map((r) => r.slug),
    );
    expect(slugs).toHaveLength(5);
    expect(slugs).not.toContain("brouillon");
  });

  it("ne voit pas les images d'un brouillon", async () => {
    const paths = await as(db, "anon", async (tx) =>
      (await tx.query<{ path: string }>("select path from public.project_images")).rows.map((r) => r.path),
    );
    expect(paths).not.toContain("draft.webp");
  });

  it("ne voit pas les entrées de parcours masquées", async () => {
    const n = await as(db, "anon", async (tx) =>
      (await tx.query<{ n: number }>("select count(*)::int n from public.timeline_entries")).rows[0]?.n,
    );
    expect(n).toBe(9);
  });

  it("ne peut ni lire ni écrire les messages", async () => {
    const visible = await as(db, "anon", async (tx) => (await tx.query("select * from public.messages")).rows.length);
    expect(visible).toBe(0);
    const error = await as(db, "anon", (tx) =>
      sqlError(() => tx.query("insert into public.messages (name, email, message) values ('x', 'x@x.fr', 'spam')")),
    );
    expect(error).toMatch(/row-level security/);
  });

  it("ne peut pas modifier le contenu", async () => {
    const error = await as(db, "anon", (tx) =>
      sqlError(() => tx.query("insert into public.projects (slug, title) values ('pirate', 'Pirate')")),
    );
    expect(error).toMatch(/row-level security/);
    const updated = await as(db, "anon", async (tx) =>
      (await tx.query("update public.profile set full_name = 'Pirate'")).affectedRows,
    );
    expect(updated).toBe(0);
  });
});

describe("RLS — utilisateur connecté non admin", () => {
  it("n'a aucun droit d'écriture", async () => {
    const error = await as(db, "user", (tx) =>
      sqlError(() => tx.query("insert into public.projects (slug, title) values ('x', 'X')")),
    );
    expect(error).toMatch(/row-level security/);
    const deleted = await as(db, "user", async (tx) => (await tx.query("delete from public.projects")).affectedRows);
    expect(deleted).toBe(0);
  });

  it("ne peut pas réordonner", async () => {
    const error = await as(db, "user", (tx) =>
      sqlError(() => tx.query("select public.reorder_rows('projects', array[]::uuid[])")),
    );
    expect(error).toMatch(/Accès refusé/);
  });

  it("ne peut pas téléverser de fichier", async () => {
    const error = await as(db, "user", (tx) =>
      sqlError(() => tx.query("insert into storage.objects (bucket_id, name) values ('media', 'x.png')")),
    );
    expect(error).toMatch(/row-level security/);
  });
});

describe("RLS — administrateur", () => {
  it("voit les brouillons et les messages", async () => {
    const result = await as(db, "admin", async (tx) => ({
      projects: (await tx.query("select 1 from public.projects")).rows.length,
      messages: (await tx.query("select 1 from public.messages")).rows.length,
    }));
    expect(result).toEqual({ projects: 6, messages: 1 });
  });

  it("peut créer, publier et réordonner des projets", async () => {
    const { expected, actual } = await as(db, "admin", async (tx) => {
      await tx.query("insert into public.projects (slug, title, status) values ('nouveau', 'Nouveau', 'published')");
      const ids = (await tx.query<{ id: string }>("select id from public.projects order by slug desc")).rows.map(
        (r) => r.id,
      );
      await tx.query("select public.reorder_rows('projects', $1::uuid[])", [ids]);
      const after = (await tx.query<{ id: string }>("select id from public.projects order by position")).rows.map(
        (r) => r.id,
      );
      return { expected: ids, actual: after };
    });
    expect(actual).toEqual(expected);
    expect(actual).toHaveLength(7);
  });

  it("peut téléverser dans les buckets du site uniquement", async () => {
    const ok = await as(db, "admin", (tx) =>
      sqlError(() => tx.query("insert into storage.objects (bucket_id, name) values ('media', 'x.png')")),
    );
    expect(ok).toBeNull();
    const refused = await as(db, "admin", (tx) =>
      sqlError(() => tx.query("insert into storage.objects (bucket_id, name) values ('autre', 'x.png')")),
    );
    expect(refused).toMatch(/row-level security/);
  });

  it("refuse une table non autorisée au réordonnancement", async () => {
    const error = await as(db, "admin", (tx) =>
      sqlError(() => tx.query("select public.reorder_rows('admins', array[]::uuid[])")),
    );
    expect(error).toMatch(/Table non autorisée/);
  });
});

describe("contraintes", () => {
  it("refuse un slug invalide", async () => {
    const error = await as(db, "admin", (tx) =>
      sqlError(() => tx.query("insert into public.projects (slug, title) values ('Pas Bon!', 'X')")),
    );
    expect(error).toMatch(/projects_slug_format/);
  });

  it("refuse une fin de période avant le début", async () => {
    const error = await as(db, "admin", (tx) =>
      sqlError(() =>
        tx.query(
          "insert into public.timeline_entries (kind, title, organization, start_date, end_date) values ('experience', 'X', 'Y', '2024-01-01', '2023-01-01')",
        ),
      ),
    );
    expect(error).toMatch(/timeline_dates_order/);
  });

  it("n'accepte qu'une seule ligne de profil", async () => {
    const error = await sqlError(() =>
      db.query("insert into public.profile (id, full_name, headline, tagline, email) values (2, 'a', 'b', 'c', 'd@e.fr')"),
    );
    expect(error).toMatch(/profile_id_check/);
  });
});
