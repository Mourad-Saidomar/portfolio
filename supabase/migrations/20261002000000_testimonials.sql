-- ════════════════════════════════════════════════════════════════════
-- Avis d'anciens collègues (section « À propos » de l'accueil)
-- Lecture publique des avis publiés uniquement ; écriture réservée à l'admin.
-- ════════════════════════════════════════════════════════════════════

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text not null default '',  -- ex. « Tuteur de stage »
  organization text not null default '',
  published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_quote_length check (char_length(quote) between 1 and 600)
);

create index testimonials_listing_idx on public.testimonials (published, position);

create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

create policy "testimonials_read_published" on public.testimonials
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "testimonials_admin_write" on public.testimonials
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Réordonnancement : la table rejoint la liste blanche.
create or replace function public.reorder_rows(target_table text, ids uuid[])
returns void
language plpgsql
security invoker            -- les policies RLS de l'appelant s'appliquent
set search_path = ''
as $$
begin
  if target_table not in ('projects', 'timeline_entries', 'skill_categories', 'skills', 'project_images', 'testimonials') then
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
