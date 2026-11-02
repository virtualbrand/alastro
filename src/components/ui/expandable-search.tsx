"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

/** Busca que começa como ícone e expande num campo ao clicar. */
export const ExpandableSearch = ({
  value,
  onChange,
  placeholder = "Buscar",
  label = "Buscar",
}: ExpandableSearchProps) => {
  // Com texto digitado a busca fica aberta, mesmo sem foco.
  const [open, setOpen] = useState(value !== "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div
      className={cn(
        "flex h-11 items-center overflow-hidden rounded-md border border-border bg-[hsl(var(--field))] transition-[width] duration-200 ease-out focus-within:border-[hsl(var(--primary-ink))]",
        open ? "w-56" : "w-11",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-expanded={open}
        tabIndex={open ? -1 : 0}
        className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="h-4 w-4" />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => value === "" && setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        aria-label={label}
        tabIndex={open ? 0 : -1}
        className="h-full min-w-0 flex-1 bg-transparent pr-1 text-sm outline-none placeholder:text-muted-foreground"
      />
      {value !== "" && (
        <button
          type="button"
          // Sem tirar o foco do campo antes do clique (o onBlur fecharia a busca).
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Limpar busca"
          className="flex h-11 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
