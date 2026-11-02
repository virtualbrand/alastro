-- =============================================================================
-- Cases — projetos da Alastro usados como prova social
--
-- Rode este arquivo no SQL Editor do painel da Supabase.
-- É idempotente: pode rodar de novo sem quebrar.
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "unaccent";

-- -----------------------------------------------------------------------------
-- Tabela
-- -----------------------------------------------------------------------------

create table if not exists public.cases (
  id            uuid primary key default gen_random_uuid(),

  slug          text not null unique,
  title         text not null,
  client        text,
  summary       text,

  -- HTML produzido pelo editor. É sanitizado na renderização.
  content       text,

  cover_url     text,
  -- Lista de URLs. jsonb em vez de text[] para caber legenda depois.
  gallery       jsonb not null default '[]'::jsonb,
  video_url     text,

  services      text[] not null default '{}',

  published     boolean not null default false,
  published_at  timestamptz,

  featured      boolean not null default false,
  -- Menor aparece primeiro na home. Nulo vai para o fim.
  featured_rank integer,

  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on column public.cases.content is
  'HTML do editor. Sempre sanitizar antes de renderizar.';

-- -----------------------------------------------------------------------------
-- Índices
-- -----------------------------------------------------------------------------

create index if not exists cases_published_idx
  on public.cases (published, published_at desc nulls last);

create index if not exists cases_featured_idx
  on public.cases (featured, featured_rank nulls last)
  where featured and published;

create index if not exists cases_services_idx
  on public.cases using gin (services);

-- -----------------------------------------------------------------------------
-- updated_at automático
-- -----------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cases_touch_updated_at on public.cases;
create trigger cases_touch_updated_at
  before update on public.cases
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- published_at preenchido na primeira publicação
-- -----------------------------------------------------------------------------

create or replace function public.stamp_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.published and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists cases_stamp_published_at on public.cases;
create trigger cases_stamp_published_at
  before insert or update on public.cases
  for each row execute function public.stamp_published_at();

-- -----------------------------------------------------------------------------
-- Privilégios
--
-- O projeto está com "Automatically expose new tables" desligado, então
-- tabela nova não recebe GRANT sozinha. Sem isto a API responde
-- 42501 "permission denied" antes mesmo de a RLS ser avaliada.
--
-- GRANT e RLS são camadas distintas: o GRANT abre a porta da tabela,
-- a RLS decide quais linhas passam.
-- -----------------------------------------------------------------------------

grant select on public.cases to anon;
grant select, insert, update, delete on public.cases to authenticated;

-- -----------------------------------------------------------------------------
-- RLS
--
-- Visitante anônimo enxerga apenas o que está publicado.
-- Qualquer usuário autenticado administra tudo — o painel é interno.
-- -----------------------------------------------------------------------------

alter table public.cases enable row level security;

drop policy if exists "cases_public_read" on public.cases;
create policy "cases_public_read"
  on public.cases
  for select
  to anon
  using (published = true);

drop policy if exists "cases_auth_read" on public.cases;
create policy "cases_auth_read"
  on public.cases
  for select
  to authenticated
  using (true);

drop policy if exists "cases_auth_insert" on public.cases;
create policy "cases_auth_insert"
  on public.cases
  for insert
  to authenticated
  with check (true);

drop policy if exists "cases_auth_update" on public.cases;
create policy "cases_auth_update"
  on public.cases
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "cases_auth_delete" on public.cases;
create policy "cases_auth_delete"
  on public.cases
  for delete
  to authenticated
  using (true);

-- -----------------------------------------------------------------------------
-- Storage: bucket de mídia
--
-- Leitura pública (as imagens aparecem no site), escrita só autenticada.
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'media');

drop policy if exists "media_auth_insert" on storage.objects;
create policy "media_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media');

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media');
