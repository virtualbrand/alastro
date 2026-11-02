"use client";

import { createClient } from "@/lib/supabase/client";
import type { ClientInput, ClientRecord } from "@/types/client";
import { describeDbError, type PostgrestLikeError } from "@/lib/db-errors";

/** Erro já com mensagem pronta para exibição. */
export class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientError";
  }
}

const describe = (error: PostgrestLikeError): string => {
  // Detalhe técnico só no console; o usuário recebe uma frase clara.
  console.error(
    "[clients]",
    error.code,
    error.message,
    error.details,
    error.hint,
  );
  return describeDbError(error);
};

export const listClients = async (): Promise<ClientRecord[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("position", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new ClientError(describe(error));
  return (data ?? []) as ClientRecord[];
};

export const createClientRecord = async (
  input: ClientInput,
): Promise<ClientRecord> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...input, created_by: user?.id ?? null })
    .select()
    .single();

  if (error) throw new ClientError(describe(error));
  return data as ClientRecord;
};

export const updateClientRecord = async (
  id: string,
  input: ClientInput,
): Promise<ClientRecord> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new ClientError(describe(error));
  return data as ClientRecord;
};

export const deleteClientRecord = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw new ClientError(describe(error));
};

/** Grava a nova ordem: ids na sequência desejada (uma chamada, atômica). */
export const reorderClients = async (ids: string[]): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.rpc("reorder_clients", { ids });
  if (error) throw new ClientError(describe(error));
};

/** Mostra ou oculta o cliente no carrossel da home, direto da listagem. */
export const setClientShowOnHome = async (
  id: string,
  showOnHome: boolean,
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("clients")
    .update({ show_on_home: showOnHome })
    .eq("id", id);
  if (error) throw new ClientError(describe(error));
};
