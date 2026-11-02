import { createPublicClient } from "@/lib/supabase/public";
import type { ClientType } from "@/types/client";

export interface SiteClient {
  title: string;
  image: string;
}

/**
 * Clientes cadastrados no painel, na ordem definida lá (arrastar e soltar),
 * dos tipos informados (todos, se omitido). Só entram os que têm foto e estão marcados para aparecer na home. Defensivo: se a tabela ainda não existir, a home
 * segue sem a fileira em vez de quebrar.
 */
export const getSiteClients = async (
  types?: ClientType[],
): Promise<SiteClient[]> => {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from("clients")
      .select("name, photo_url")
      .eq("show_on_home", true)
      .order("position", { ascending: true })
      .order("name", { ascending: true });
    if (types) query = query.in("type", types);

    const { data } = await query;

    return (data ?? [])
      .filter((c) => Boolean(c.photo_url))
      .map((c) => ({ title: c.name as string, image: c.photo_url as string }));
  } catch {
    return [];
  }
};
