export const CASE_CATEGORIES = [
  { value: "case", label: "Case" },
  { value: "bastidores", label: "Bastidores" },
] as const;

export type CaseCategory = (typeof CASE_CATEGORIES)[number]["value"];

/** Máximo de cases em destaque por categoria (case e bastidores contam separado). */
export const FEATURED_LIMIT = 6;

export const categoryLabel = (category: CaseCategory): string =>
  CASE_CATEGORIES.find((c) => c.value === category)?.label ?? category;

export interface CaseRecord {
  id: string;
  slug: string;
  title: string;
  category: CaseCategory;
  /** Rótulo derivado dos clientes vinculados (mantido por trigger no banco). */
  client: string | null;
  /** Clientes vinculados; só vem preenchido nas consultas do painel. */
  client_ids?: string[];
  summary: string | null;
  /** HTML do editor. Sanitizar antes de renderizar. */
  content: string | null;
  cover_url: string | null;
  /** Vídeo curto mostrado no hover do card (webm com fallback mp4). */
  hover_video_webm_url: string | null;
  hover_video_mp4_url: string | null;
  gallery: string[];
  video_url: string | null;
  services: string[];
  /** Tags livres, usadas como filtro em /cases. */
  tags: string[];
  published: boolean;
  published_at: string | null;
  featured: boolean;
  featured_rank: number | null;
  /** Ordem de exibição (menor primeiro) na lista do painel e em /cases. */
  position: number;
  created_at: string;
  updated_at: string;
}

/** Campos que o formulário do painel controla. */
export type CaseInput = Pick<
  CaseRecord,
  | "slug"
  | "title"
  | "category"
  | "summary"
  | "content"
  | "cover_url"
  | "hover_video_webm_url"
  | "hover_video_mp4_url"
  | "gallery"
  | "video_url"
  | "services"
  | "tags"
  | "published"
  | "featured"
  | "featured_rank"
> & {
  /** Clientes vinculados (tabela case_clients). */
  client_ids: string[];
};
