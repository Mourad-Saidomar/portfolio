-- ════════════════════════════════════════════════════════════════════
-- Portfolio — schéma initial
-- Lecture publique des contenus publiés uniquement ; écriture réservée à l'admin.
-- ════════════════════════════════════════════════════════════════════


-- ─── Administrateur unique ───────────────────────────────────────────

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Utilisateurs autorisés à écrire. Une seule ligne attendue (administrateur unique).';

alter table public.admins enable row level security;
-- Aucune policy : table invisible via l'API, gérée par le seed / le SQL editor.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ─── Utilitaire updated_at ───────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Profil (ligne unique) ───────────────────────────────────────────

create table public.profile (
  id smallint primary key default 1 check (id = 1),
  full_name text not null,
  headline text not null,                       -- métier affiché
  tagline text not null,                        -- proposition de valeur (hero)
  intro text not null default '',               -- sous-titre du hero
  bio text not null default '',                 -- présentation (paragraphes séparés par une ligne vide)
  availability text not null default '',        -- ex. « Disponible pour un stage à partir de … »
  location text not null default '',
  email text not null,
  phone text,
  show_phone boolean not null default false,
  photo_path text,                              -- chemin dans le bucket « media »
  photo_alt text not null default '',
  cv_path text,                                 -- chemin dans le bucket « documents »
  cv_updated_at timestamptz,
  github_url text,
  linkedin_url text,
  website_url text,
  core_values jsonb not null default '[]'::jsonb,           -- [{ title, description }]
  differentiators jsonb not null default '[]'::jsonb,  -- [{ title, description }]
  languages jsonb not null default '[]'::jsonb,        -- [{ name, level }]
  interests text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint profile_core_values_is_array check (jsonb_typeof(core_values) = 'array'),
  constraint profile_differentiators_is_array check (jsonb_typeof(differentiators) = 'array'),
  constraint profile_languages_is_array check (jsonb_typeof(languages) = 'array'),
  constraint profile_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create trigger profile_updated_at before update on public.profile
  for each row execute function public.set_updated_at();

-- ─── Parcours ────────────────────────────────────────────────────────

create type public.timeline_kind as enum ('experience', 'education');
create type public.date_precision as enum ('month', 'year');

create table public.timeline_entries (
  id uuid primary key default gen_random_uuid(),
  kind public.timeline_kind not null,
  title text not null,
  organization text not null,
  location text not null default '',
  start_date date,                      -- null = date à compléter
  end_date date,
  is_current boolean not null default false,
  date_precision public.date_precision not null default 'year',
  description text not null default '',
  highlights text[] not null default '{}',
  published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint timeline_dates_order check (end_date is null or start_date is null or end_date >= start_date),
  constraint timeline_current_has_no_end check (not (is_current and end_date is not null))
);

create index timeline_entries_listing_idx
  on public.timeline_entries (published, is_current desc, start_date desc nulls first, position);

create trigger timeline_entries_updated_at before update on public.timeline_entries
  for each row execute function public.set_updated_at();

-- ─── Compétences ─────────────────────────────────────────────────────

create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories (id) on delete cascade,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  constraint skills_unique_name_per_category unique (category_id, name)
);

create index skill_categories_position_idx on public.skill_categories (position);
create index skills_category_position_idx on public.skills (category_id, position);

create trigger skill_categories_updated_at before update on public.skill_categories
  for each row execute function public.set_updated_at();

-- ─── Projets ─────────────────────────────────────────────────────────

create type public.publication_status as enum ('draft', 'published');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  period text not null default '',              -- ex. « 2026 », « Sept. – Oct. 2026 »
  cover_path text,
  cover_alt text not null default '',
  context jsonb,                                -- documents Tiptap (JSON)
  problem jsonb,
  role jsonb,
  solution jsonb,
  results jsonb,
  stack text[] not null default '{}',
  demo_url text,
  repo_url text,
  status public.publication_status not null default 'draft',
  featured boolean not null default false,
  position integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index projects_listing_idx on public.projects (status, position);
create index projects_featured_idx on public.projects (featured) where status = 'published';

create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- Horodate la première publication.
create or replace function public.set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger projects_published_at before insert or update of status on public.projects
  for each row execute function public.set_published_at();

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null,
  alt text not null default '',
  caption text not null default '',
  width integer,
  height integer,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_position_idx on public.project_images (project_id, position);

-- ─── Messages du formulaire de contact ──────────────────────────────

create type public.message_status as enum ('new', 'read', 'archived');

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 1 and 5000),
  ip_hash text,                                 -- IP hachée + salée (limitation de débit), jamais l'IP brute
  status public.message_status not null default 'new',
  created_at timestamptz not null default now()
);

create index messages_status_created_idx on public.messages (status, created_at desc);
create index messages_rate_limit_idx on public.messages (ip_hash, created_at desc);

-- ════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════════

alter table public.profile enable row level security;
alter table public.timeline_entries enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.messages enable row level security;

-- Profil : public en lecture.
create policy "profile_read_all" on public.profile
  for select to anon, authenticated using (true);
create policy "profile_admin_write" on public.profile
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Parcours : entrées publiées visibles ; l'admin voit tout.
create policy "timeline_read_published" on public.timeline_entries
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "timeline_admin_write" on public.timeline_entries
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Compétences : publiques.
create policy "skill_categories_read_all" on public.skill_categories
  for select to anon, authenticated using (true);
create policy "skill_categories_admin_write" on public.skill_categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "skills_read_all" on public.skills
  for select to anon, authenticated using (true);
create policy "skills_admin_write" on public.skills
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Projets : seuls les projets publiés sont publics.
create policy "projects_read_published" on public.projects
  for select to anon, authenticated using (status = 'published' or (select public.is_admin()));
create policy "projects_admin_write" on public.projects
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "project_images_read_published" on public.project_images
  for select to anon, authenticated using (
    (select public.is_admin())
    or exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and p.status = 'published'
    )
  );
create policy "project_images_admin_write" on public.project_images
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Messages : admin uniquement. L'insertion passe par le serveur (clé service_role),
-- après validation, honeypot et limitation de débit : aucune policy d'insertion publique.
create policy "messages_admin_read" on public.messages
  for select to authenticated using ((select public.is_admin()));
create policy "messages_admin_update" on public.messages
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "messages_admin_delete" on public.messages
  for delete to authenticated using ((select public.is_admin()));

-- ════════════════════════════════════════════════════════════════════
-- Réordonnancement atomique (glisser-déposer)
-- ════════════════════════════════════════════════════════════════════

create or replace function public.reorder_rows(target_table text, ids uuid[])
returns void
language plpgsql
security invoker            -- les policies RLS de l'appelant s'appliquent
set search_path = ''
as $$
begin
  if target_table not in ('projects', 'timeline_entries', 'skill_categories', 'skills', 'project_images') then
    raise exception 'Table non autorisée : %', target_table;
  end if;
  if not public.is_admin() then
    raise exception 'Accès refusé' using errcode = '42501';
  end if;
  execute format(
    'update public.%I t set position = o.ord - 1
       from unnest($1) with ordinality as o(id, ord)
      where t.id = o.id',
    target_table
  ) using ids;
end;
$$;

revoke all on function public.reorder_rows(text, uuid[]) from public, anon;
grant execute on function public.reorder_rows(text, uuid[]) to authenticated;

-- ════════════════════════════════════════════════════════════════════
-- Storage
-- ════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('documents', 'documents', true, 10485760, array['application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Buckets publics : les fichiers sont servis par URL publique, sans policy de lecture
-- (pas de listing possible). Écritures réservées à l'admin.
create policy "media_documents_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('media', 'documents') and (select public.is_admin()));
create policy "media_documents_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('media', 'documents') and (select public.is_admin()))
  with check (bucket_id in ('media', 'documents') and (select public.is_admin()));
create policy "media_documents_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('media', 'documents') and (select public.is_admin()));
create policy "media_documents_admin_select" on storage.objects
  for select to authenticated
  using (bucket_id in ('media', 'documents') and (select public.is_admin()));
