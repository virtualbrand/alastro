"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Plus, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  /** Texto secundário na lista, ex.: o tipo do cliente. */
  hint?: string;
  /** Miniatura opcional exibida antes do nome. */
  imageUrl?: string | null;
}

interface MultiSearchSelectProps {
  options: SelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  emptyText?: string;
  /** Opções ainda sendo carregadas: mostra linhas de esqueleto no lugar da lista. */
  loading?: boolean;
  /** Quando informado, oferece cadastrar o termo digitado se ele não existir. */
  onCreate?: (query: string) => void;
  className?: string;
}

const normalize = (v: string) =>
  v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Select com busca e seleção múltipla: o que já foi escolhido sai da lista e
 * vira um chip removível logo abaixo.
 */
export const MultiSearchSelect = ({
  options,
  selected,
  onChange,
  placeholder,
  emptyText = "Nenhum resultado",
  loading = false,
  onCreate,
  className,
}: MultiSearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const available = options.filter(
    (o) =>
      !selected.includes(o.value) &&
      normalize(o.label).includes(normalize(query.trim())),
  );

  const trimmed = query.trim();
  const canCreate =
    Boolean(onCreate) &&
    trimmed !== "" &&
    !options.some((o) => normalize(o.label) === normalize(trimmed));

  const create = () => {
    onCreate?.(trimmed);
    setQuery("");
    setOpen(false);
  };

  const add = (value: string) => {
    onChange([...selected, value]);
    setQuery("");
  };

  // Valores sem opção correspondente (ex.: serviço antigo digitado à mão) continuam removíveis.
  const chips = selected.map(
    (value) =>
      options.find((o) => o.value === value) ?? { value, label: value },
  );

  return (
    <div className={className}>
      <div ref={ref} className="relative">
        <div className="relative">
          <input
            className={cn(
              "h-11 w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 pr-10 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]",
              // Aberto, o campo e a lista formam um bloco só.
              open && "rounded-b-none border-[hsl(var(--primary-ink))]",
            )}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Enter") {
                e.preventDefault();
                if (available[0]) add(available[0].value);
                else if (canCreate) create();
              }
            }}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          />
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </div>

        {open && (
          <ul className="absolute inset-x-0 top-full z-20 max-h-60 overflow-auto rounded-b-md border border-t-0 border-[hsl(var(--primary-ink))] bg-[hsl(var(--field))] py-1 text-foreground shadow-md">
            {loading ? (
              // Mesma altura de uma opção real: py-2 + miniatura de 28px.
              [0, 1, 2].map((i) => (
                <li
                  key={i}
                  aria-hidden
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <Skeleton className="h-7 w-7 shrink-0" />
                  <Skeleton className="h-4 flex-1" />
                </li>
              ))
            ) : available.length === 0 && !canCreate ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {emptyText}
              </li>
            ) : (
              available.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => {
                      add(o.value);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    {o.imageUrl !== undefined && (
                      <span className="h-7 w-7 shrink-0 overflow-hidden rounded bg-muted">
                        {o.imageUrl && (
                          <img
                            src={o.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                    )}
                    <span className="flex-1">{o.label}</span>
                    {o.hint && (
                      <span className="text-xs text-muted-foreground">
                        {o.hint}
                      </span>
                    )}
                  </button>
                </li>
              ))
            )}
            {canCreate && (
              <li className="border-t border-border">
                <button
                  type="button"
                  onClick={create}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-bold text-[hsl(var(--primary-ink))] transition-colors hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar &ldquo;{trimmed}&rdquo;
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {chips.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip.value}>
              <button
                type="button"
                onClick={() =>
                  onChange(selected.filter((v) => v !== chip.value))
                }
                aria-label={`Remover ${chip.label}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
