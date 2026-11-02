"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  /** Tags já usadas em outros cases, oferecidas ao digitar. */
  suggestions?: string[];
  maxTags?: number;
  className?: string;
}

const MAX_LENGTH = 30;

const normalize = (v: string) =>
  v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Aparo, junta espaços repetidos e limita o tamanho. */
const clean = (raw: string) => raw.replace(/\s+/g, " ").trim().slice(0, MAX_LENGTH);

/**
 * Campo de tags livres: digite e tecle Enter ou vírgula para adicionar; Backspace com o campo
 * vazio remove a última. Evita duplicatas sem diferenciar maiúsculas e acentos, e reaproveita a
 * grafia de uma tag já existente (assim "Triatlo" e "triatlo" não viram duas).
 */
export const TagInput = ({
  value,
  onChange,
  suggestions = [],
  maxTags = 10,
  className,
}: TagInputProps) => {
  const [query, setQuery] = useState("");
  const listId = useId();

  const add = (raw: string) => {
    const text = clean(raw);
    if (!text || value.length >= maxTags) return;
    const key = normalize(text);
    if (value.some((tag) => normalize(tag) === key)) return;
    const canonical = suggestions.find((tag) => normalize(tag) === key) ?? text;
    onChange([...value, canonical]);
  };

  const commit = () => {
    add(query);
    setQuery("");
  };

  const options = suggestions.filter(
    (tag) => !value.some((selected) => normalize(selected) === normalize(tag)),
  );

  return (
    <div className={cn("space-y-2", className)}>
      <input
        type="text"
        value={query}
        maxLength={MAX_LENGTH}
        list={listId}
        disabled={value.length >= maxTags}
        placeholder={
          value.length >= maxTags
            ? `Limite de ${maxTags} tags`
            : "Digite e tecle Enter para adicionar..."
        }
        onChange={(event) => {
          const text = event.target.value;
          // Vírgula funciona como Enter (também ao colar "a, b, c").
          if (text.includes(",")) {
            text.split(",").forEach(add);
            setQuery("");
          } else {
            setQuery(text);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          } else if (event.key === "Backspace" && !query && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        className="w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 py-2 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))] disabled:opacity-60"
      />
      <datalist id={listId}>
        {options.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1 rounded-full border border-border bg-muted py-1 pl-3 pr-1.5 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== tag))}
                aria-label={`Remover tag ${tag}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
