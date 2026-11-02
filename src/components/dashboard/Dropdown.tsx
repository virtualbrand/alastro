"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * Lista suspensa do painel, no lugar do <select> nativo, cujo menu é desenhado pelo sistema
 * (no macOS ele saía escuro e colado na seta). Aqui o menu tem fundo claro, borda e sombra, e
 * a seta tem espaço próprio.
 *
 * `variant`: "field" ocupa a largura toda, como um input; "chip" é a pílula compacta das listas
 * (a cor vem de `className`).
 *
 * Os valores precisam ser texto não vazio (limitação do Radix): quem tem "sem valor" usa um
 * marcador, como "none".
 */
export function Dropdown({
  value,
  onChange,
  options,
  variant = "field",
  disabled,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  variant?: "field" | "chip";
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-between gap-3 outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          variant === "field"
            ? "h-11 w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 text-sm focus:border-[hsl(var(--primary-ink))] data-[state=open]:border-[hsl(var(--primary-ink))]"
            : "rounded-full py-1 pl-3 pr-2.5 text-xs font-bold",
          className,
        )}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          align={variant === "chip" ? "end" : "start"}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-[hsl(var(--field))] p-1 font-amplitude text-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-4 text-sm outline-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4 text-[hsl(var(--primary-ink))]" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
