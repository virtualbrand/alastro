-- =============================================================================
-- Blog — artigos com categoria, tags e busca
--
-- Rode este arquivo no SQL Editor do painel da Supabase.
-- É idempotente: pode rodar de novo sem quebrar.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Categorias — um artigo pertence a no máximo uma
-- -----------------------------------------------------------------------------

create table if not exists public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Tags — um artigo pode ter várias
--
-- Tabela própria em vez de um text[] no post: evita que "Audiovisual" e
-- "audiovisual" virem duas tags distintas, e permite renomear num lugar só.
-- -----------------------------------------------------------------------------

create table if not exists public.blog_tags (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Artigos
-- -----------------------------------------------------------------------------

create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),

  slug          text not null unique,
  title         text not null,
  excerpt       text,

  -- HTML produzido pelo editor. É sanitizado na renderização.
  content       text,

  cover_url     text,
  author_name   text,

  category_id   uuid references public.blog_categories (id) on delete set null,

  published     boolean not null default false,
  published_at  timestamptz,

  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Vetor de busca em português, com peso por campo:
  -- título pesa mais que resumo, que pesa mais que o corpo.
  -- O regexp remove as tags HTML para não indexar marcação.
  search_vector tsvector generated always as (
    setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(excerpt, '')), 'B') ||
    setweight(
      to_tsvector(
        'portuguese',
        regexp_replace(coalesce(content, ''), '<[^>]*>', ' ', 'g')
      ),
      'C'
    )
  ) stored
);

comment on column public.blog_posts.content is
  'HTML do editor. Sempre sanitizar antes de renderizar.';

-- -----------------------------------------------------------------------------
-- Relação artigo <-> tags
-- -----------------------------------------------------------------------------

create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id  uuid not null references public.blog_tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

-- -----------------------------------------------------------------------------
-- Índices
-- -----------------------------------------------------------------------------

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, published_at desc nulls last);

create index if not exists blog_posts_category_idx
  on public.blog_posts (category_id);

create index if not exists blog_posts_search_idx
  on public.blog_posts using gin (search_vector);

create index if not exists blog_post_tags_tag_idx
  on public.blog_post_tags (tag_id);

-- -----------------------------------------------------------------------------
-- Triggers (reaproveitam as funções criadas em 0001_cases.sql)
-- -----------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.stamp_published_at()
returns trigger language plpgsql as $$
begin
  if new.published and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists blog_posts_touch_updated_at on public.blog_posts;
create trigger blog_posts_touch_updated_at
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();

drop trigger if exists blog_posts_stamp_published_at on public.blog_posts;
create trigger blog_posts_stamp_published_at
  before insert or update on public.blog_posts
  for each row execute function public.stamp_published_at();

-- -----------------------------------------------------------------------------
-- Privilégios
--
-- "Automatically expose new tables" está desligado neste projeto, então o
-- GRANT precisa ser explícito. Sem ele a API devolve 42501 antes mesmo de
-- avaliar a RLS.
-- -----------------------------------------------------------------------------

grant select on public.blog_categories to anon;
grant select on public.blog_tags       to anon;
grant select on public.blog_posts      to anon;
grant select on public.blog_post_tags  to anon;

grant select, insert, update, delete on public.blog_categories to authenticated;
grant select, insert, update, delete on public.blog_tags       to authenticated;
grant select, insert, update, delete on public.blog_posts      to authenticated;
grant select, insert, update, delete on public.blog_post_tags  to authenticated;

-- -----------------------------------------------------------------------------
-- RLS
--
-- Anônimo lê apenas artigos publicados. Categorias e tags são públicas:
-- são rótulos de navegação, não contêm informação sensível.
-- -----------------------------------------------------------------------------

alter table public.blog_categories enable row level security;
alter table public.blog_tags       enable row level security;
alter table public.blog_posts      enable row level security;
alter table public.blog_post_tags  enable row level security;

-- Categorias
drop policy if exists "blog_categories_public_read" on public.blog_categories;
create policy "blog_categories_public_read"
  on public.blog_categories for select to anon, authenticated using (true);

drop policy if exists "blog_categories_auth_write" on public.blog_categories;
create policy "blog_categories_auth_write"
  on public.blog_categories for all to authenticated using (true) with check (true);

-- Tags
drop policy if exists "blog_tags_public_read" on public.blog_tags;
create policy "blog_tags_public_read"
  on public.blog_tags for select to anon, authenticated using (true);

drop policy if exists "blog_tags_auth_write" on public.blog_tags;
create policy "blog_tags_auth_write"
  on public.blog_tags for all to authenticated using (true) with check (true);

-- Artigos
drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read"
  on public.blog_posts for select to anon using (published = true);

drop policy if exists "blog_posts_auth_read" on public.blog_posts;
create policy "blog_posts_auth_read"
  on public.blog_posts for select to authenticated using (true);

drop policy if exists "blog_posts_auth_write" on public.blog_posts;
create policy "blog_posts_auth_write"
  on public.blog_posts for all to authenticated using (true) with check (true);

-- Relação artigo <-> tag: o vínculo só é visível se o artigo for público.
drop policy if exists "blog_post_tags_public_read" on public.blog_post_tags;
create policy "blog_post_tags_public_read"
  on public.blog_post_tags for select to anon
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = post_id and p.published = true
    )
  );

drop policy if exists "blog_post_tags_auth_write" on public.blog_post_tags;
create policy "blog_post_tags_auth_write"
  on public.blog_post_tags for all to authenticated using (true) with check (true);
