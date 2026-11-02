"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  ProposalInput,
  ProposalRecord,
  ProposalStatus,
} from "@/types/proposal";
import { describeDbError, type PostgrestLikeError } from "@/lib/db-errors";

export class ProposalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProposalError";
  }
}

const describe = (error: PostgrestLikeError): string => {
  // Detalhe técnico só no console; o usuário recebe uma frase clara.
  console.error(
    "[propostas]",
    error.code,
    error.message,
    error.details,
    error.hint,
  );
  return describeDbError(error, {
    duplicate: "Já existe uma proposta com essa URL. Altere o campo de URL.",
  });
};

export const listProposals = async (): Promise<ProposalRecord[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new ProposalError(describe(error));
  return (data ?? []) as ProposalRecord[];
};

export const createProposal = async (
  input: ProposalInput,
): Promise<ProposalRecord> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("proposals")
    .insert({ ...input, created_by: user?.id ?? null })
    .select()
    .single();
  if (error) throw new ProposalError(describe(error));
  return data as ProposalRecord;
};

export const updateProposal = async (
  id: string,
  input: ProposalInput,
): Promise<ProposalRecord> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("proposals")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new ProposalError(describe(error));
  return data as ProposalRecord;
};

export const deleteProposal = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) throw new ProposalError(describe(error));
};

export const setProposalStatus = async (
  id: string,
  status: ProposalStatus,
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("proposals")
    .update({ status })
    .eq("id", id);
  if (error) throw new ProposalError(describe(error));
};

/** Duplica uma proposta como rascunho — base para o próximo cliente. */
export const duplicateProposal = async (
  source: ProposalRecord,
): Promise<ProposalRecord> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { id, created_at, updated_at, sent_at, ...rest } = source;

  const { data, error } = await supabase
    .from("proposals")
    .insert({
      ...rest,
      slug: `${source.slug}-copia-${Date.now().toString(36)}`,
      title: `${source.title} (cópia)`,
      status: "rascunho",
      published: false,
      sent_at: null,
      created_by: user?.id ?? null,
    })
    .select()
    .single();

  if (error) throw new ProposalError(describe(error));
  return data as ProposalRecord;
};
