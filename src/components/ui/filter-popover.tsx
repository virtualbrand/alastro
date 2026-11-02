"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ListFilter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tip } from "@/components/ui/tip";

export type FilterMode = "any" | "all";

export interface FilterOption {
  value: string;
  label: string;
  /** Texto secundário, ex.: o tipo do cliente. */
  hint?: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  /**
   * Regra entre as opções marcadas do grupo: "any" = OU (qualquer uma),
   * "all" = E (todas). Sem `onModeChange` o grupo não oferece a escolha e é sempre OU.
   */
  mode?: FilterMode;
  onModeChange?: (mode: FilterMode) => void;
}

const MODE_HELP: Record<FilterMode, string> = {
  any: "Mostra o que tem qualquer um destes",
  all: "Mostra só o que tem todos estes",
};

const normalize = (v: string) =>
  v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Grupos com mais opções que isto ganham um campo de busca interno. */
const SEARCH_THRESHOLD = 6;

const GroupSection = ({ group }: { group: FilterGroup }) => {
  const [query, setQuery] = useState("");
  const { options, selected, onChange, mode = "any", onModeChange } = group;

  const visible = options.filter((o) =>
    normalize(o.label).includes(normalize(query.trim())),
  );

  const toggle = (value: string) =>
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        <h3 className="flex-1 text-xs font-bold uppercase tracking-wide">
          {group.label}
          {selected.length > 0 && (
            <span className="ml-1.5 text-muted-foreground">
              ({selected.length})
            </span>
          )}
        </h3>

        {onModeChange && (
          <div
            role="group"
            aria-label={`Regra do filtro de ${group.label}`}
            className="flex overflow-hidden rounded border border-border text-[11px] font-bold"
          >
            {(["any", "all"] as const).map((option) => (
              <Tip label={MODE_HELP[option]}>
                <button
                  key={option}
                  type="button"
                  onClick={() => onModeChange(option)}
                  aria-pressed={mode === option}

                  className={cn(
                    "px-2 py-1 transition-colors",
                    mode === option
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option === "any" ? "OU" : "E"}
                </button>
              </Tip>
            ))}
          </div>
        )}

        {selected.length > 0 && (
          <Tip label={"Limpar"}>
            <button
              type="button"
              onClick={() => onChange([])}
              aria-label={`Limpar filtro de ${group.label}`}
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Tip>
        )}
      </div>

      {onModeChange && selected.length > 1 && (
        <p className="text-xs text-muted-foreground">{MODE_HELP[mode]}</p>
      )}

      {options.length > SEARCH_THRESHOLD && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Buscar ${group.label.toLowerCase()}`}
          aria-label={`Buscar em ${group.label}`}
          className="h-9 w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]"
        />
      )}

      <div className="max-h-44 space-y-0.5 overflow-y-auto">
        {visible.length === 0 ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">
            Nada encontrado.
          </p>
        ) : (
          visible.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={selected.includes(o.value)}
                onChange={() => toggle(o.value)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-[hsl(var(--primary-ink))]"
              />
              <span className="flex-1 font-bold">{o.label}</span>
              {o.hint && (
                <span className="text-xs text-muted-foreground">{o.hint}</span>
              )}
            </label>
          ))
        )}
      </div>
    </section>
  );
};

/**
 * Funil que abre um painel com grupos de filtro (checkboxes). Cada grupo pode
 * escolher a própria regra entre OU e E; entre grupos diferentes o resultado
 * precisa atender a todos. O contador no botão soma as opções marcadas.
 */
export const FilterPopover = ({ groups }: { groups: FilterGroup[] }) => {
  const total = groups.reduce((sum, g) => sum + g.selected.length, 0);
  const activeGroups = groups.filter((g) => g.selected.length > 0).length;

  return (
    <Popover.Root>
      <Tip label="Filtros">
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label="Filtros"
            className={cn(
              "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-[hsl(var(--field))] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              total > 0 &&
                "border-[hsl(var(--primary-ink))] text-[hsl(var(--primary-ink))]",
            )}
          >
            <ListFilter className="h-4 w-4" />
            {total > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(74_70%_33%)] px-1 text-[11px] font-bold text-white">
                {total}
              </span>
            )}
          </button>
        </Popover.Trigger>
      </Tip>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          // `painel`: o conteúdo sai da árvore do painel (portal) e precisa dos mesmos tokens de tema.
          className="painel z-50 max-h-[80vh] w-80 space-y-4 overflow-y-auto rounded-md border border-border bg-background p-4 text-foreground shadow-lg outline-none"
        >
          {groups.map((group, index) => (
            <div key={group.id}>
              {index > 0 && <div className="mb-4 h-px bg-border" />}
              <GroupSection group={group} />
            </div>
          ))}

          {activeGroups > 1 && (
            <p className="text-xs text-muted-foreground">
              Entre grupos, o resultado precisa atender a todos.
            </p>
          )}

          {total > 0 && (
            <button
              type="button"
              onClick={() => groups.forEach((g) => g.onChange([]))}
              className="text-xs font-bold text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Limpar todos os filtros
            </button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
