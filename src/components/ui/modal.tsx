"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

/**
 * Janela centralizada para formulários curtos. Usa só fade (opacity) na
 * animação: o `animate-in` do tailwindcss-animate reescreve o `transform` e
 * quebraria a centralização por translate.
 */
const Modal = DialogPrimitive.Root;

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // `painel`: o modal sai da árvore do painel (portal) e precisa dos mesmos tokens de tema.
        "painel fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl outline-none data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
ModalContent.displayName = "ModalContent";

export { Modal, ModalContent };
