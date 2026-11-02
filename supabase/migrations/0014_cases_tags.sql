-- Tags livres do case, para o filtro da página /cases (ex.: "triatlo", "esporte").
-- Rode no SQL Editor da Supabase. Idempotente.
alter table public.cases
  add column if not exists tags text[] not null default '{}';

create index if not exists cases_tags_idx
  on public.cases using gin (tags);

notify pgrst, 'reload schema';
