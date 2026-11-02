"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface RadioCardOption<T extends string> {
  value: T;
  label: string;
}

interface RadioCardGroupProps<T extends string> {
  label: string;
  options: readonly RadioCardOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Opções de escolha única em "cartões" com radio nativo (setas do teclado, foco visível). */
export const RadioCardGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
}: RadioCardGroupProps<T>) => {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <span
        id={`${id}-label`}
        className="block text-xs font-bold uppercase tracking-wide"
      >
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const active = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[hsl(var(--primary-ink)/0.3)]",
                active
                  ? "border-[hsl(var(--primary-ink))] bg-muted text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={id}
                value={option.value}
                checked={active}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 cursor-pointer accent-[hsl(var(--primary-ink))]"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};
