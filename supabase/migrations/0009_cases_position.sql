-- =============================================================================
-- Ordem dos cases (arrastar e soltar no painel)
--
-- `position` define a ordem da página pública /cases e da lista do painel.
-- Menor aparece primeiro. Case novo entra no topo, como era antes (mais
-- recente primeiro). Rode no SQL Editor da Supabase. Idempotente.
-- =============================================================================

alter table public.cases
  add column if not exists position integer not null default 0;

-- Ordem inicial: a que já era exibida (publicação mais recente primeiro).
update public.cases c
set position = r.rn - 1
from (
  select id,
         row_number() over (
           order by published_at desc nulls last, created_at desc
         ) as rn
  from public.cases
) r
where c.id = r.id
  and not exists (select 1 from public.cases where position <> 0);

create index if not exists cases_position_idx
  on public.cases (position, created_at desc);

-- Case novo entra no topo da fila.
create or replace function public.cases_set_position()
returns trigger
language plpgsql
as $$
begin
  new.position = coalesce((select min(position) - 1 from public.cases), 0);
  return new;
end;
$$;

drop trigger if exists cases_position_on_insert on public.cases;
create trigger cases_position_on_insert
  before insert on public.cases
  for each row execute function public.cases_set_position();

-- Grava a ordem inteira numa chamada só (atômica): ids na ordem desejada.
create or replace function public.reorder_cases(ids uuid[])
returns void
language sql
as $$
  update public.cases c
  set position = o.ord - 1
  from unnest(ids) with ordinality as o(id, ord)
  where c.id = o.id;
$$;

grant execute on function public.reorder_cases(uuid[]) to authenticated;

notify pgrst, 'reload schema';
