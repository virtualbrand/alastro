-- =============================================================================
-- Preferências por usuário do painel (ex.: visualização da lista de clientes)
--
-- Uma linha por (usuário, chave). Cada usuário só enxerga e altera as próprias:
-- a preferência de um não influencia a de outro. Rode no SQL Editor da
-- Supabase. Idempotente.
-- =============================================================================

create table if not exists public.user_preferences (
  user_id    uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  key        text not null,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

drop trigger if exists user_preferences_touch_updated_at on public.user_preferences;
create trigger user_preferences_touch_updated_at
  before update on public.user_preferences
  for each row execute function public.touch_updated_at();

grant select, insert, update, delete on public.user_preferences to authenticated;

alter table public.user_preferences enable row level security;

drop policy if exists "user_preferences_own_select" on public.user_preferences;
create policy "user_preferences_own_select"
  on public.user_preferences for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "user_preferences_own_insert" on public.user_preferences;
create policy "user_preferences_own_insert"
  on public.user_preferences for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "user_preferences_own_update" on public.user_preferences;
create policy "user_preferences_own_update"
  on public.user_preferences for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "user_preferences_own_delete" on public.user_preferences;
create policy "user_preferences_own_delete"
  on public.user_preferences for delete to authenticated
  using (user_id = auth.uid());

notify pgrst, 'reload schema';
