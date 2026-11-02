-- Limite de destaques por categoria: no máximo 6 cases em destaque em "case" e 6
-- em "bastidores". O painel já avisa antes; este gatilho é a garantia no banco
-- (duas pessoas destacando ao mesmo tempo, ou outra ferramenta escrevendo).
-- Só valida quem passa a ser destaque: o que já passa do limite não é alterado.
-- Rode no SQL Editor da Supabase. Idempotente.

create or replace function public.cases_limit_featured()
returns trigger
language plpgsql
as $$
begin
  if new.featured
     and (tg_op = 'INSERT'
          or old.featured is distinct from true
          or old.category is distinct from new.category) then
    if (
      select count(*) from public.cases
      where featured and category = new.category and id <> new.id
    ) >= 6 then
      raise exception 'featured_limit: a categoria % já tem 6 destaques', new.category
        using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists cases_limit_featured on public.cases;
create trigger cases_limit_featured
  before insert or update on public.cases
  for each row execute function public.cases_limit_featured();

notify pgrst, 'reload schema';
