-- Categoria do case: um projeto normal ("case") ou material de bastidores.
-- Rode no SQL Editor da Supabase. Idempotente.
alter table public.cases
  add column if not exists category text not null default 'case';

alter table public.cases
  drop constraint if exists cases_category_check;
alter table public.cases
  add constraint cases_category_check check (category in ('case', 'bastidores'));

create index if not exists cases_category_idx on public.cases (category);

notify pgrst, 'reload schema';
