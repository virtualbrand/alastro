"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface TipProps {
  /** Texto do tooltip. Vazio, o filho é renderizado sem tooltip. */
  label: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Tooltip do painel, no lugar do atributo `title` do navegador (que não aceita
 * estilo). Claro no tema claro e escuro no tema escuro, pelos tokens `card`.
 *
 * O filho precisa aceitar ref e eventos (um <button>, <a> ou componente Radix).
 * Botão `disabled` não dispara eventos de ponteiro; para ele mostrar o
 * tooltip use `aria-disabled` no lugar.
 */
export const Tip = ({ label, children, side = "top" }: TipProps) => {
  if (!label) return children;

  return (
    <TooltipPrimitive.Provider delayDuration={250} skipDelayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={8}
            collisionPadding={12}
            // `painel`: o tooltip sai da árvore do painel (portal) e precisa dos mesmos tokens de tema.
            className="painel pointer-events-none z-[80] max-w-xs rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold text-card-foreground shadow-lg data-[state=delayed-open]:animate-fade-in data-[state=instant-open]:animate-fade-in"
          >
            {label}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
