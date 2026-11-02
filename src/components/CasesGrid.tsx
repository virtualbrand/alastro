"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { CaseCardCover } from "@/components/CaseCardCover";
import { ExpandableSearch } from "@/components/ui/expandable-search";
import { FilterPopover, type FilterGroup } from "@/components/ui/filter-popover";
import { cn } from "@/lib/utils";
import type { CaseCategory } from "@/types/case";

export interface CaseCard {
  id: string;
  slug: string;
  title: string;
  category: CaseCategory;
  /** Nomes dos clientes vinculados (usados no filtro). */
  clients: string[];
  client: string | null;
  summary: string | null;
  services: string[];
  tags: string[];
  cover_url: string | null;
  hover_video_webm_url: string | null;
  hover_video_mp4_url: string | null;
}

interface Filters {
  category: CaseCategory | "all";
  services: string[];
  clients: string[];
  tags: string[];
  query: string;
}

const EMPTY_FILTERS: Filters = {
  category: "all",
  services: [],
  clients: [],
  tags: [],
  query: "",
};

type FacetKey = "services" | "clients" | "tags";

const CATEGORY_TABS: { value: Filters["category"]; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "case", label: "Cases" },
  { value: "bastidores", label: "Bastidores" },
];

const FACETS: { key: FacetKey; param: string; label: string }[] = [
  { key: "services", param: "servico", label: "Serviço" },
  { key: "clients", param: "cliente", label: "Cliente" },
  { key: "tags", param: "tag", label: "Tags" },
];

const normalize = (v: string) =>
  v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Regra do filtro: dentro de um grupo vale OU (qualquer valor marcado); entre grupos vale E.
 * `skip` ignora um grupo, para contar quantos cases cada opção dele traria (contagem facetada).
 */
const matches = (item: CaseCard, filters: Filters, skip?: FacetKey): boolean => {
  if (filters.category !== "all" && item.category !== filters.category) return false;

  for (const { key } of FACETS) {
    if (key === skip || filters[key].length === 0) continue;
    if (!filters[key].some((value) => item[key].includes(value))) return false;
  }

  const query = normalize(filters.query.trim());
  if (query) {
    const haystack = normalize(
      [item.title, item.summary ?? "", ...item.clients, ...item.services, ...item.tags].join(" "),
    );
    if (!query.split(/\s+/).every((word) => haystack.includes(word))) return false;
  }
  return true;
};

const readFilters = (search: string): Filters => {
  const params = new URLSearchParams(search);
  const category = params.get("categoria");
  return {
    category: category === "case" || category === "bastidores" ? category : "all",
    services: params.getAll("servico"),
    clients: params.getAll("cliente"),
    tags: params.getAll("tag"),
    query: params.get("q") ?? "",
  };
};

const writeFilters = (filters: Filters): string => {
  const params = new URLSearchParams();
  if (filters.category !== "all") params.set("categoria", filters.category);
  for (const { key, param } of FACETS) {
    for (const value of filters[key]) params.append(param, value);
  }
  if (filters.query.trim()) params.set("q", filters.query.trim());
  return params.toString();
};

const tabClass = (active: boolean) =>
  cn(
    "text-base font-bold uppercase tracking-wide transition-colors",
    active
      ? "text-[hsl(74_70%_33%)]"
      : "text-[var(--color-text-secondary)] hover:text-[hsl(74_70%_33%)]",
  );

/** Espera depois da última tecla antes de filtrar, para a grade não piscar a cada letra. */
const SEARCH_DELAY_MS = 300;

const GUTTER = "px-6 md:px-12 lg:px-20 xl:px-24";

/**
 * Grade de cases com busca e filtros (categoria, serviço, cliente e tags). Os filtros ficam na URL
 * (?categoria=&servico=&cliente=&tag=&q=): o link da seleção é compartilhável. A página é
 * renderizada completa no servidor e os filtros do link são aplicados depois de montar.
 */
export const CasesGrid = ({ cases }: { cases: CaseCard[] }) => {
  // `input` é o que está no campo (responde na hora); `filters` é o que de fato filtra a grade.
  const [input, setInput] = useState<Filters>(EMPTY_FILTERS);
  const [ready, setReady] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState("");
  const filters = useMemo(() => ({ ...input, query: appliedQuery }), [input, appliedQuery]);
  const setFilters = setInput;

  useEffect(() => {
    const initial = readFilters(window.location.search);
    setInput(initial);
    setAppliedQuery(initial.query);
    setReady(true);
  }, []);

  useEffect(() => {
    // Limpar o campo vale na hora; digitar espera a pausa.
    const timer = setTimeout(() => setAppliedQuery(input.query), input.query === "" ? 0 : SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [input.query]);

  useEffect(() => {
    if (!ready) return;
    const query = writeFilters(filters);
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState(window.history.state, "", url);
  }, [filters, ready]);

  const visible = useMemo(() => cases.filter((item) => matches(item, filters)), [cases, filters]);

  const hasFilters =
    filters.category !== "all" ||
    filters.query.trim() !== "" ||
    FACETS.some(({ key }) => filters[key].length > 0);

  const categories = useMemo(() => new Set(cases.map((item) => item.category)), [cases]);

  // Opções de cada grupo: só o que tem case, com a contagem considerando os outros filtros.
  // O que ficaria com zero some, exceto o que já está marcado (para poder desmarcar).
  const groups: FilterGroup[] = FACETS.flatMap(({ key, label }) => {
    const counts = new Map<string, number>();
    for (const item of cases) {
      if (!matches(item, filters, key)) continue;
      for (const value of item[key]) counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    const values = new Set([...counts.keys(), ...filters[key]]);
    if (values.size === 0) return [];

    return [
      {
        id: key,
        label,
        options: Array.from(values)
          .sort((a, b) => a.localeCompare(b, "pt-BR"))
          .map((value) => ({ value, label: value, hint: String(counts.get(value) ?? 0) })),
        selected: filters[key],
        onChange: (selected: string[]) => setFilters((current) => ({ ...current, [key]: selected })),
      },
    ];
  });

  const removeValue = (key: FacetKey, value: string) =>
    setFilters((current) => ({ ...current, [key]: current[key].filter((v) => v !== value) }));

  const clear = () => setFilters(EMPTY_FILTERS);

  return (
    <>
      {/* `painel`: dá aos componentes de busca e filtro (iguais aos do dashboard) os tokens de tema deles. */}
      <div className={cn("painel mb-10 space-y-4", GUTTER)}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {categories.size > 1 ? (
            <div role="group" aria-label="Filtrar por categoria" className="flex gap-x-6">
              {CATEGORY_TABS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filters.category === value}
                  onClick={() => setFilters((current) => ({ ...current, category: value }))}
                  className={tabClass(filters.category === value)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2 md:justify-end">
            <ExpandableSearch
              value={input.query}
              onChange={(query) => setFilters((current) => ({ ...current, query }))}
              placeholder="Buscar cases"
              label="Buscar cases"
            />
            {groups.length > 0 && <FilterPopover groups={groups} />}
          </div>
        </div>

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2" aria-live="polite">
            <span className="mr-2 text-xs text-foreground/70">
              {visible.length} {visible.length === 1 ? "case" : "cases"}
            </span>
            {FACETS.flatMap(({ key }) =>
              filters[key].map((value) => (
                <button
                  key={`${key}:${value}`}
                  type="button"
                  onClick={() => removeValue(key, value)}
                  aria-label={`Remover filtro ${value}`}
                  className="flex items-center gap-1 rounded-full border border-foreground/30 py-1 pl-3 pr-2 text-xs text-foreground transition-colors hover:border-foreground"
                >
                  {value}
                  <X className="h-3 w-3" />
                </button>
              )),
            )}
            <button
              type="button"
              onClick={clear}
              className="ml-auto text-xs font-bold text-foreground/70 underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className={cn("space-y-3 text-center text-[var(--color-text-secondary)]", GUTTER)}>
          <p className="opacity-70">Nenhum case encontrado com esses filtros.</p>
          <button
            type="button"
            onClick={clear}
            className="text-sm font-bold underline underline-offset-4 transition-colors hover:text-[hsl(74_70%_33%)]"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id}>
              <Link
                href={`/cases/${item.slug}`}
                className="group relative block overflow-hidden"
              >
                <CaseCardCover
                  coverUrl={item.cover_url}
                  hoverVideoWebmUrl={item.hover_video_webm_url}
                  hoverVideoMp4Url={item.hover_video_mp4_url}
                  className="aspect-[3/2] rounded-none"
                />

                {/* Escurece e mostra o texto no hover; em telas de toque fica sempre visível. */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
                  {item.client && (
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-accent-green)]">
                      {item.client}
                    </p>
                  )}
                  <h2 className="text-xl font-bold text-white">{item.title}</h2>
                  {item.summary && (
                    <p className="mt-1 line-clamp-2 text-sm text-white/80">
                      {item.summary}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
