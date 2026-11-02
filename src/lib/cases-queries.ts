import { createPublicClient } from "@/lib/supabase/public";
import { FEATURED_LIMIT, type CaseCategory } from "@/types/case";

/** Dados mínimos de um case em destaque para os cards da home. */
export interface HomeCase {
  id: string;
  slug: string;
  title: string;
  category: CaseCategory;
  /** Nomes dos clientes vinculados, já juntos (ex.: "Guudrun · Manu Cit"). */
  client: string | null;
  summary: string | null;
  services: string[];
  cover_url: string | null;
  video_url: string | null;
  hover_video_webm_url: string | null;
  hover_video_mp4_url: string | null;
}

/**
 * Cases publicados e em destaque de uma categoria ("case" ou "bastidores"),
 * na ordem da lista do painel (a mesma de /cases). Defensivo: se a consulta
 * falhar (tabela ou coluna ainda sem migration), a home segue sem a fileira.
 */
export const getFeaturedCases = async (
  category: CaseCategory,
  limit = FEATURED_LIMIT,
): Promise<HomeCase[]> => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("cases")
      .select(
        "id, slug, title, category, client, summary, services, cover_url, video_url, hover_video_webm_url, hover_video_mp4_url",
      )
      .eq("published", true)
      .eq("featured", true)
      .eq("category", category)
      .order("position", { ascending: true })
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    return (data ?? []) as HomeCase[];
  } catch {
    return [];
  }
};
