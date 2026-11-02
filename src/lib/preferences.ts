import { createClient } from "@/lib/supabase/server";

/**
 * Lê uma preferência do usuário logado (server components). Devolve null se não
 * houver, ou se a tabela ainda não existir: quem chama usa o padrão.
 */
export const getUserPreference = async (key: string): Promise<unknown> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("user_preferences")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    return data?.value ?? null;
  } catch {
    return null;
  }
};
