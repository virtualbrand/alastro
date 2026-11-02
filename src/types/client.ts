export const CLIENT_TYPES = [
  { value: "personalidade", label: "Personalidade" },
  { value: "artista", label: "Artista" },
  { value: "marca", label: "Marca" },
] as const;

export type ClientType = (typeof CLIENT_TYPES)[number]["value"];

export const clientTypeLabel = (type: ClientType): string =>
  CLIENT_TYPES.find((t) => t.value === type)?.label ?? type;

export interface ClientRecord {
  id: string;
  name: string;
  type: ClientType;
  photo_url: string | null;
  /** Ordem de exibição (menor primeiro). */
  position: number;
  /** Aparece no carrossel de clientes da home. */
  show_on_home: boolean;
  created_at: string;
  updated_at: string;
}

/** Campos que o formulário do painel controla. */
export type ClientInput = Pick<ClientRecord, "name" | "type" | "photo_url">;
