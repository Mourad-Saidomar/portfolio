/**
 * Pré-remplit la base Supabase à partir de CONTENT.md (supabase/seed/content.ts).
 *
 *   npm run db:seed            → insère ce qui manque, ne touche pas aux lignes existantes
 *   npm run db:seed -- --force → réécrit les lignes du seed (écrase les modifications faites dans l'admin)
 *
 * Nécessite NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local.
 * Si ADMIN_EMAIL et ADMIN_PASSWORD sont définis, crée (ou retrouve) le compte administrateur unique.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Database } from "../../lib/supabase/database.types";
import { buildSeedRows } from "./rows";

const force = process.argv.includes("--force");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis (.env.local).");
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const MEDIA_DIR = join(process.cwd(), "public", "demo", "media");

function fail(step: string, error: { message: string } | null): void {
  if (error) {
    console.error(`✗ ${step} : ${error.message}`);
    process.exit(1);
  }
}

async function uploadMedia(paths: string[]): Promise<void> {
  for (const path of new Set(paths)) {
    const body = await readFile(join(MEDIA_DIR, path));
    const { error } = await supabase.storage
      .from("media")
      .upload(path, body, { contentType: "image/webp", upsert: force, cacheControl: "31536000" });
    if (error && !/exists|Duplicate/i.test(error.message)) fail(`upload ${path}`, error);
  }
  console.log(`✓ ${new Set(paths).size} images dans le bucket « media »`);
}

async function ensureAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("• ADMIN_EMAIL / ADMIN_PASSWORD absents : compte admin non créé (voir README).");
    return;
  }
  if (password.length < 12) {
    console.error("✗ ADMIN_PASSWORD doit contenir au moins 12 caractères.");
    process.exit(1);
  }

  let userId: string | undefined;
  const created = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.data.user) {
    userId = created.data.user.id;
  } else {
    // Déjà existant : on le retrouve.
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    fail("recherche de l'admin", error);
    userId = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  }
  if (!userId) {
    console.error(`✗ Impossible de créer ou retrouver ${email}.`);
    process.exit(1);
  }

  const { count } = await supabase.from("admins").select("*", { count: "exact", head: true });
  const { data: existing } = await supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  if (!existing && (count ?? 0) > 0) {
    console.error("✗ Un administrateur existe déjà : un seul compte admin est autorisé.");
    process.exit(1);
  }
  fail("enregistrement de l'admin", (await supabase.from("admins").upsert({ user_id: userId })).error);
  console.log(`✓ Administrateur : ${email}`);
}

async function main(): Promise<void> {
  const rows = buildSeedRows();
  const options = { onConflict: "id", ignoreDuplicates: !force };

  await uploadMedia(
    [
      rows.profile.photo_path,
      ...rows.projects.map((p) => p.cover_path),
      ...rows.projectImages.map((i) => i.path),
    ].filter((p): p is string => Boolean(p)),
  );

  fail("profil", (await supabase.from("profile").upsert(rows.profile, options)).error);
  fail("parcours", (await supabase.from("timeline_entries").upsert(rows.timeline, options)).error);
  fail("catégories", (await supabase.from("skill_categories").upsert(rows.skillCategories, options)).error);
  fail("compétences", (await supabase.from("skills").upsert(rows.skills, options)).error);
  fail("projets", (await supabase.from("projects").upsert(rows.projects, options)).error);
  fail("images", (await supabase.from("project_images").upsert(rows.projectImages, options)).error);
  console.log(
    `✓ Contenu ${force ? "réécrit" : "inséré (lignes existantes conservées)"} : ` +
      `${rows.projects.length} projets, ${rows.timeline.length} étapes, ${rows.skills.length} compétences`,
  );

  await ensureAdmin();
  console.log("\nTerminé. Pensez à téléverser votre CV depuis /admin/profil.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
