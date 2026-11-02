"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Columns2, Columns3, List } from "lucide-react";
import type { ViewMode } from "@/lib/view-mode";
import { Tip } from "@/components/ui/tip";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "list", label: "Lista", icon: List },
  { value: "grid-3", label: "3 colunas", icon: Columns3 },
  { value: "grid-2", label: "2 colunas", icon: Columns2 },
] as const;

/** Menu de visualização: o botão mostra o ícone do modo atual. */
export const ViewSwitcher = ({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) => {
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu.Root>
      <Tip label={`Visualização: ${current.label}`}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label={`Visualização: ${current.label}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-[hsl(var(--field))] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:border-[hsl(var(--primary-ink))] data-[state=open]:text-foreground"
          >
            <CurrentIcon className="h-4 w-4" />
          </button>
        </DropdownMenu.Trigger>
      </Tip>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          // `painel`: o menu sai da árvore do painel (portal) e precisa dos mesmos tokens de tema.
          className="painel z-50 min-w-40 rounded-md border border-border bg-background p-1 text-foreground shadow-lg outline-none"
        >
          <DropdownMenu.RadioGroup
            value={value}
            onValueChange={(next) => onChange(next as ViewMode)}
          >
            {OPTIONS.map(({ value: option, label, icon: Icon }) => (
              <DropdownMenu.RadioItem
                key={option}
                value={option}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm font-bold outline-none transition-colors data-[highlighted]:bg-muted",
                  value === option
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                <DropdownMenu.ItemIndicator>
                  <Check className="h-4 w-4 text-[hsl(var(--primary-ink))]" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
