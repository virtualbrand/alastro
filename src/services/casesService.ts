"use client";

import { createClient } from "@/lib/supabase/client";
import type { CaseInput, CaseRecord } from "@/types/case";
import { describeDbError, type PostgrestLikeError } from "@/lib/db-errors";

/** Erro já com mensagem pronta para exibição. */
export class CaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CaseError";
  }
}

/**
 * Traduz o erro para uma frase clara ao usuário (ver describeDbError). O
 * detalhe técnico vai para o console, que é de onde se diagnostica.
 */
const describe = (error: PostgrestLikeError): string => {
  // Detalhe técnico só no console; o usuário recebe uma frase clara.
  console.error(
    "[cases]",
    error.code,
    error.message,
    error.details,
    error.hint,
  );
  return describeDbError(error, {
    duplicate: "Já existe um case com essa URL. Altere o campo de URL.",
  });
};

type CaseRow = Omit<CaseRecord, "client_ids"> & {
  case_clients: { client_id: string }[] | null;
};

/** Achata a relação embutida em `client_ids`. */
const toRecord = ({ case_clients, ...row }: CaseRow): CaseRecord => ({
  ...row,
  client_ids: (case_clients ?? []).map((link) => link.client_id),
});

export const listCases = async (): Promise<CaseRecord[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*, case_clients(client_id)")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new CaseError(describe(error));
  return ((data ?? []) as CaseRow[]).map(toRecord);
};

/** Tags já usadas em algum case, em ordem alfabética: sugestões para o campo de tags. */
export const listCaseTags = async (): Promise<string[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("cases").select("tags");

  if (error) throw new CaseError(describe(error));
  const tags = new Set<string>();
  for (const row of (data ?? []) as { tags: string[] | null }[]) {
    for (const tag of row.tags ?? []) tags.add(tag);
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b, "pt-BR"));
};

/** Substitui os vínculos do case pelos clientes informados. */
const replaceCaseClients = async (
  caseId: string,
  clientIds: string[],
): Promise<void> => {
  const supabase = createClient();
  const { error: deleteError } = await supabase
    .from("case_clients")
    .delete()
    .eq("case_id", caseId);
  if (deleteError) throw new CaseError(describe(deleteError));

  if (clientIds.length === 0) return;
  const { error } = await supabase
    .from("case_clients")
    .insert(clientIds.map((client_id) => ({ case_id: caseId, client_id })));
  if (error) throw new CaseError(describe(error));
};

export const getCase = async (id: string): Promise<CaseRecord | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new CaseError(describe(error));
  return (data as CaseRecord) ?? null;
};

export const createCase = async ({
  client_ids,
  ...input
}: CaseInput): Promise<CaseRecord> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("cases")
    .insert({ ...input, created_by: user?.id ?? null })
    .select()
    .single();

  if (error) throw new CaseError(describe(error));
  await replaceCaseClients((data as CaseRecord).id, client_ids);
  return data as CaseRecord;
};

export const updateCase = async (
  id: string,
  { client_ids, ...input }: CaseInput,
): Promise<CaseRecord> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cases")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new CaseError(describe(error));
  await replaceCaseClients(id, client_ids);
  return data as CaseRecord;
};

export const deleteCase = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from("cases").delete().eq("id", id);
  if (error) throw new CaseError(describe(error));
};

/** Alterna publicado/rascunho direto da listagem. */
export const setCasePublished = async (
  id: string,
  published: boolean,
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("cases")
    .update({ published })
    .eq("id", id);
  if (error) throw new CaseError(describe(error));
};

/** Alterna o destaque na home direto da listagem. */
export const setCaseFeatured = async (
  id: string,
  featured: boolean,
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("cases")
    .update({ featured })
    .eq("id", id);
  if (error) throw new CaseError(describe(error));
};

/** Grava a nova ordem: ids na sequência desejada (uma chamada, atômica). */
export const reorderCases = async (ids: string[]): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.rpc("reorder_cases", { ids });
  if (error) throw new CaseError(describe(error));
};

/** Grava a ordem dos destaques da home (featured_rank 1..n), numa chamada só. */
export const reorderFeaturedCases = async (ids: string[]): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.rpc("reorder_featured_cases", { ids });
  if (error) throw new CaseError(describe(error));
};
