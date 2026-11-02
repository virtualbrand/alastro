-- =============================================================================
-- Propostas comerciais
--
-- Modelada a partir das propostas Grupo Zit e Hostel da Vila + Albatroz.
-- Só o que varia por cliente vira coluna: capa, "sobre a Alastro" e
-- "clientes atendidos" são fixos da marca e ficam no template da página.
--
-- Rode este arquivo no SQL Editor do painel da Supabase.
-- É idempotente: pode rodar de novo sem quebrar.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Situação da proposta no funil
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'proposal_status') then
    create type public.proposal_status as enum (
      'rascunho', 'enviada', 'aceita', 'recusada'
    );
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Tabela
--
-- Blocos repetidos (entregáveis, opções, exclusões, seções finais) ficam em
-- jsonb: são sempre lidos junto com a proposta, nunca consultados sozinhos,
-- e a ordem importa. Tabelas separadas só acrescentariam joins e uma coluna
-- de ordenação sem ganho.
-- -----------------------------------------------------------------------------

create table if not exists public.proposals (
  id             uuid primary key default gen_random_uuid(),

  slug           text not null unique,
  title          text not null,

  -- Cliente
  client_name    text not null,
  client_contact text,

  cover_url      text,

  -- Texto corrido (HTML do editor, sanitizado na renderização)
  project        text,   -- "Projeto"
  approach       text,   -- "Narrativa" / abordagem

  -- [{ "title": "Pré-produção e desenvolvimento", "description": "..." }]
  deliverables   jsonb not null default '[]'::jsonb,

  -- [{ "name": "Proposta 1", "subtitle": "Mini Documentário",
  --    "description": "...", "includes": ["02 diárias", ...],
  --    "note": "...", "price_cents": 1013000 }]
  options        jsonb not null default '[]'::jsonb,

  -- ["Execução de stories", "Gestão de WhatsApp", ...]
  exclusions     jsonb not null default '[]'::jsonb,

  -- [{ "title": "Informações complementares", "content": "<p>...</p>" }]
  sections       jsonb not null default '[]'::jsonb,

  -- Validade. As duas referências usam 48 horas a partir do envio.
  validity_hours integer not null default 48,
  sent_at        timestamptz,

  status         public.proposal_status not null default 'rascunho',

  -- Controla a página pública em /proposta/<slug>
  published      boolean not null default false,

  created_by     uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on column public.proposals.project is
  'HTML do editor. Sempre sanitizar antes de renderizar.';
comment on column public.proposals.validity_hours is
  'Horas de validade contadas a partir de sent_at.';

-- -----------------------------------------------------------------------------
-- Índices
-- -----------------------------------------------------------------------------

create index if not exists proposals_status_idx
  on public.proposals (status, created_at desc);

create index if not exists proposals_client_idx
  on public.proposals (client_name);

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists proposals_touch_updated_at on public.proposals;
create trigger proposals_touch_updated_at
  before update on public.proposals
  for each row execute function public.touch_updated_at();

-- Marca o envio na primeira vez que a proposta sai do rascunho.
create or replace function public.stamp_sent_at()
returns trigger language plpgsql as $$
begin
  if new.status <> 'rascunho' and new.sent_at is null then
    new.sent_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists proposals_stamp_sent_at on public.proposals;
create trigger proposals_stamp_sent_at
  before insert or update on public.proposals
  for each row execute function public.stamp_sent_at();

-- -----------------------------------------------------------------------------
-- Privilégios
--
-- "Automatically expose new tables" está desligado neste projeto, então o
-- GRANT precisa ser explícito.
-- -----------------------------------------------------------------------------

grant select on public.proposals to anon;
grant select, insert, update, delete on public.proposals to authenticated;

-- -----------------------------------------------------------------------------
-- RLS
--
-- Proposta é documento comercial: o anônimo só enxerga a que estiver
-- publicada, e o acesso se dá por conhecer o slug.
-- -----------------------------------------------------------------------------

alter table public.proposals enable row level security;

drop policy if exists "proposals_public_read" on public.proposals;
create policy "proposals_public_read"
  on public.proposals for select to anon
  using (published = true);

drop policy if exists "proposals_auth_read" on public.proposals;
create policy "proposals_auth_read"
  on public.proposals for select to authenticated using (true);

drop policy if exists "proposals_auth_write" on public.proposals;
create policy "proposals_auth_write"
  on public.proposals for all to authenticated using (true) with check (true);
