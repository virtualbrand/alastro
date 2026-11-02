"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

/** Editor de lista de strings — usado em "Inclui:" e "Não incluso". */
export const ListEditor = ({
  items,
  onChange,
  placeholder,
  emptyLabel,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  emptyLabel: string;
}) => {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="h-10 w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          aria-label="Adicionar item"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-[hsl(var(--primary-ink))]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-start gap-2 rounded bg-muted/60 px-3 py-2 text-sm"
            >
              <span className="flex-1">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                aria-label={`Remover "${item}"`}
                className="mt-0.5 text-muted-foreground transition-colors hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
