-- =============================================================================
-- Clientes — personalidades, artistas e marcas atendidos pela Alastro
--
-- Alimentarão a seção "Clientes" do site. Rode no SQL Editor da Supabase.
-- É idempotente: pode rodar de novo sem quebrar.
-- =============================================================================

create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),

  name        text not null,
  type        text not null check (type in ('personalidade', 'artista', 'marca')),
  photo_url   text,

  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists clients_type_idx on public.clients (type, name);

drop trigger if exists clients_touch_updated_at on public.clients;
create trigger clients_touch_updated_at
  before update on public.clients
  for each row execute function public.touch_updated_at();

-- Privilégios e RLS (mesmo modelo de cases): o site lê, o painel administra.
grant select on public.clients to anon;
grant select, insert, update, delete on public.clients to authenticated;

alter table public.clients enable row level security;

drop policy if exists "clients_public_read" on public.clients;
create policy "clients_public_read"
  on public.clients for select to anon using (true);

drop policy if exists "clients_auth_read" on public.clients;
create policy "clients_auth_read"
  on public.clients for select to authenticated using (true);

drop policy if exists "clients_auth_insert" on public.clients;
create policy "clients_auth_insert"
  on public.clients for insert to authenticated with check (true);

drop policy if exists "clients_auth_update" on public.clients;
create policy "clients_auth_update"
  on public.clients for update to authenticated using (true) with check (true);

drop policy if exists "clients_auth_delete" on public.clients;
create policy "clients_auth_delete"
  on public.clients for delete to authenticated using (true);

notify pgrst, 'reload schema';
