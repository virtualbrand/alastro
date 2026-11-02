"use client";

import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";

/**
 * Casca de um item de lista reordenável. Usa botões de subir/descer em vez
 * de arrastar: funciona com teclado e leitor de tela sem biblioteca extra.
 */
export const RepeaterItem = ({
  index,
  total,
  label,
  onMove,
  onRemove,
  children,
}: {
  index: number;
  total: number;
  label: string;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  children: React.ReactNode;
}) => (
  <li className="rounded-md border border-border bg-card p-4 text-card-foreground">
    <div className="mb-3 flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <GripVertical className="h-4 w-4" aria-hidden />
        {label}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          aria-label={`Mover ${label} para cima`}
          className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, index + 1)}
          disabled={index === total - 1}
          aria-label={`Mover ${label} para baixo`}
          className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`Remover ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>

    <div className="space-y-3">{children}</div>
  </li>
);
