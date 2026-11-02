export type ProposalStatus = "rascunho" | "enviada" | "aceita" | "recusada";

export const PROPOSAL_STATUS_LABEL: Record<ProposalStatus, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  aceita: "Aceita",
  recusada: "Recusada",
};

/** Um bloco da seção "Entregáveis". */
export interface Deliverable {
  title: string;
  description: string;
}

/** Uma das opções de investimento ("Proposta 1", "Proposta 2"...). */
export interface ProposalOption {
  name: string;
  subtitle: string;
  description: string;
  /** Itens da lista "Inclui:". */
  includes: string[];
  /** Parágrafo de fechamento abaixo da lista. */
  note: string;
  /** Em centavos, para não depender de ponto flutuante. */
  price_cents: number;
}

/** Bloco de texto livre no fim: Informações complementares, Direção, Contrato... */
export interface ProposalSection {
  title: string;
  /** HTML do editor. Sanitizar antes de renderizar. */
  content: string;
}

export interface ProposalRecord {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  client_contact: string | null;
  cover_url: string | null;
  project: string | null;
  approach: string | null;
  deliverables: Deliverable[];
  options: ProposalOption[];
  exclusions: string[];
  sections: ProposalSection[];
  validity_hours: number;
  sent_at: string | null;
  status: ProposalStatus;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type ProposalInput = Pick<
  ProposalRecord,
  | "slug"
  | "title"
  | "client_name"
  | "client_contact"
  | "cover_url"
  | "project"
  | "approach"
  | "deliverables"
  | "options"
  | "exclusions"
  | "sections"
  | "validity_hours"
  | "status"
  | "published"
>;

export const emptyDeliverable = (): Deliverable => ({
  title: "",
  description: "",
});

export const emptyOption = (index: number): ProposalOption => ({
  name: `Proposta ${index}`,
  subtitle: "",
  description: "",
  includes: [],
  note: "",
  price_cents: 0,
});

export const emptySection = (): ProposalSection => ({
  title: "",
  content: "",
});

/** Centavos para "R$ 10.130,00". */
export const formatPrice = (cents: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format((cents || 0) / 100);

/** "10.130,00", "10130.00" ou "R$ 10.130" para centavos. */
export const parsePrice = (value: string): number => {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
};

/** Momento em que a proposta expira, ou null se ainda não foi enviada. */
export const expiresAt = (proposal: ProposalRecord): Date | null => {
  if (!proposal.sent_at) return null;
  return new Date(
    new Date(proposal.sent_at).getTime() + proposal.validity_hours * 3_600_000
  );
};

export const isExpired = (proposal: ProposalRecord): boolean => {
  const expiry = expiresAt(proposal);
  return expiry ? expiry.getTime() < Date.now() : false;
};
