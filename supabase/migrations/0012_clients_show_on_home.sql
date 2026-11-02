-- Mostrar ou ocultar o cliente no carrossel da home. Quem já existe continua
-- aparecendo (padrão: verdadeiro). Rode no SQL Editor da Supabase. Idempotente.
alter table public.clients
  add column if not exists show_on_home boolean not null default true;

notify pgrst, 'reload schema';
