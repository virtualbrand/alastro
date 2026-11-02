-- =============================================================================
-- Vínculo case <-> cliente (muitos para muitos)
--
-- Um case pode ter vários clientes (ex.: um artista + uma marca).
-- cases.client continua existindo como RÓTULO derivado ("Xamã · Dux"): os
-- triggers abaixo o recalculam, então as páginas públicas seguem lendo só
-- cases.client e o nome atualiza sozinho quando o cliente é renomeado.
-- Rode no SQL Editor da Supabase. Idempotente.
-- =============================================================================

create table if not exists public.case_clients (
  case_id    uuid not null references public.cases (id) on delete cascade,
  client_id  uuid not null references public.clients (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (case_id, client_id)
);

create index if not exists case_clients_client_idx
  on public.case_clients (client_id);

-- Recalcula cases.client a partir dos vínculos (nulo se não restar nenhum).
-- Só roda quando um vínculo muda, então o texto antigo de um case que nunca
-- foi vinculado fica intacto.
create or replace function public.refresh_case_client_label(target uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.cases c
  set client = (
    select string_agg(cl.name, ' · ' order by cl.name)
    from public.case_clients cc
    join public.clients cl on cl.id = cc.client_id
    where cc.case_id = c.id
  )
  where c.id = target;
$$;

create or replace function public.case_clients_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_case_client_label(coalesce(new.case_id, old.case_id));
  return null;
end;
$$;

drop trigger if exists case_clients_label on public.case_clients;
create trigger case_clients_label
  after insert or delete on public.case_clients
  for each row execute function public.case_clients_changed();

create or replace function public.client_renamed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  linked uuid;
begin
  for linked in
    select case_id from public.case_clients where client_id = new.id
  loop
    perform public.refresh_case_client_label(linked);
  end loop;
  return null;
end;
$$;

drop trigger if exists clients_renamed on public.clients;
create trigger clients_renamed
  after update of name on public.clients
  for each row when (old.name is distinct from new.name)
  execute function public.client_renamed();

-- Vincula automaticamente os cases antigos cujo texto de cliente coincide
-- com o nome de um cliente já cadastrado.
insert into public.case_clients (case_id, client_id)
select c.id, cl.id
from public.cases c
join public.clients cl on lower(cl.name) = lower(c.client)
on conflict do nothing;

-- Privilégios e RLS (mesmo modelo das demais tabelas)
grant select on public.case_clients to anon;
grant select, insert, update, delete on public.case_clients to authenticated;

alter table public.case_clients enable row level security;

drop policy if exists "case_clients_public_read" on public.case_clients;
create policy "case_clients_public_read"
  on public.case_clients for select to anon using (true);

drop policy if exists "case_clients_auth_all" on public.case_clients;
create policy "case_clients_auth_all"
  on public.case_clients for all to authenticated using (true) with check (true);

-- Faz a API (PostgREST) enxergar a tabela e a relação novas sem esperar.
notify pgrst, 'reload schema';
