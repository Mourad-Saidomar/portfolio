import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Postgres en mémoire (PGlite) qui reproduit le strict nécessaire de Supabase :
 * rôles anon/authenticated, auth.uid(), schéma storage, privilèges par défaut.
 */
const SUPABASE_STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;

  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated;

  create schema storage;
  create table storage.buckets (
    id text primary key, name text, public boolean,
    file_size_limit bigint, allowed_mime_types text[]
  );
  create table storage.objects (
    id uuid primary key default gen_random_uuid(), bucket_id text, name text
  );
  alter table storage.objects enable row level security;
  grant usage on schema storage to anon, authenticated;
  grant all on storage.objects to anon, authenticated;
`;

export const ADMIN_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
export const USER_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

export async function createDatabase(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(SUPABASE_STUB);
  const dir = join(process.cwd(), "supabase", "migrations");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(join(dir, file), "utf8"));
  }
  await db.exec(`
    insert into auth.users (id, email) values
      ('${ADMIN_ID}', 'admin@example.com'), ('${USER_ID}', 'user@example.com');
    insert into public.admins (user_id) values ('${ADMIN_ID}');
  `);
  return db;
}

type Row = Record<string, unknown>;

export async function insertRows(db: PGlite, table: string, rows: Row[]): Promise<void> {
  for (const row of rows) {
    const columns = Object.keys(row);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const values = columns.map((c) => {
      const v = row[c];
      return v !== null && typeof v === "object" && !Array.isArray(v) ? JSON.stringify(v) : v;
    });
    await db.query(
      `insert into public.${table} (${columns.map((c) => `"${c}"`).join(", ")}) values (${placeholders})`,
      values,
    );
  }
}

/** Exécute `fn` dans une transaction en tant que rôle donné, puis annule tout. */
export async function as<T>(
  db: PGlite,
  who: "anon" | "admin" | "user",
  fn: (db: PGlite) => Promise<T>,
): Promise<T> {
  const role = who === "anon" ? "anon" : "authenticated";
  const sub = who === "admin" ? ADMIN_ID : who === "user" ? USER_ID : "";
  await db.exec("begin");
  try {
    await db.exec(`set local role ${role}`);
    await db.query(`select set_config('request.jwt.claim.sub', $1, true)`, [sub]);
    return await fn(db);
  } finally {
    await db.exec("rollback");
  }
}

/** Capture l'erreur SQL attendue (renvoie son message, ou null si la requête a réussi). */
export async function sqlError(run: () => Promise<unknown>): Promise<string | null> {
  try {
    await run();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}
