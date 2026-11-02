-- Grava a ordem dos destaques da home numa chamada só (atômica): ids dos cases
-- em destaque na ordem desejada. Usa featured_rank (1, 2, 3...), que a seção de
-- destaques da home já lê. Rode no SQL Editor da Supabase. Idempotente.
create or replace function public.reorder_featured_cases(ids uuid[])
returns void
language sql
as $$
  update public.cases c
  set featured_rank = o.ord
  from unnest(ids) with ordinality as o(id, ord)
  where c.id = o.id;
$$;

grant execute on function public.reorder_featured_cases(uuid[]) to authenticated;

notify pgrst, 'reload schema';
