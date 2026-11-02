-- =============================================================================
-- Ordem dos clientes (arrastar e soltar no painel)
--
-- `position` define a ordem de exibição: o painel e, no futuro, a home leem
-- clients ordenados por (position, name). Menor aparece primeiro.
-- Rode no SQL Editor da Supabase. Idempotente.
-- =============================================================================

alter table public.clients
  add column if not exists position integer not null default 0;

-- Ordem inicial: alfabética (só para quem ainda não foi ordenado).
update public.clients c
set position = r.rn - 1
from (
  select id, row_number() over (order by name) as rn
  from public.clients
) r
where c.id = r.id
  and not exists (select 1 from public.clients where position <> 0);

create index if not exists clients_position_idx
  on public.clients (position, name);

-- Cliente novo entra no fim da fila.
create or replace function public.clients_set_position()
returns trigger
language plpgsql
as $$
begin
  new.position = coalesce((select max(position) + 1 from public.clients), 0);
  return new;
end;
$$;

drop trigger if exists clients_position_on_insert on public.clients;
create trigger clients_position_on_insert
  before insert on public.clients
  for each row execute function public.clients_set_position();

-- Grava a ordem inteira numa chamada só (atômica): ids na ordem desejada.
create or replace function public.reorder_clients(ids uuid[])
returns void
language sql
as $$
  update public.clients c
  set position = o.ord - 1
  from unnest(ids) with ordinality as o(id, ord)
  where c.id = o.id;
$$;

grant execute on function public.reorder_clients(uuid[]) to authenticated;

notify pgrst, 'reload schema';
