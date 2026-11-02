"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Painel lateral à direita, sobre o conteúdo, com overlay e foco preso. */
const Drawer = DialogPrimitive.Root;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // `painel`: o drawer sai da árvore do painel (portal) e precisa dos mesmos tokens de tema.
        "painel fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-3xl flex-col border-l border-border bg-background shadow-2xl outline-none data-[state=open]:animate-drawer-in data-[state=closed]:animate-drawer-out",
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  children,
  actions,
}: {
  className?: string;
  children: React.ReactNode;
  /** Controles à direita, antes do botão de fechar. */
  actions?: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4 border-b border-border px-6 py-4",
      className,
    )}
  >
    <div className="min-w-0 space-y-1">{children}</div>
    <div className="flex shrink-0 items-center gap-5">
      {actions}
      <DialogPrimitive.Close
        aria-label="Fechar"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
    </div>
  </div>
);

const DrawerTitle = DialogPrimitive.Title;
const DrawerDescription = DialogPrimitive.Description;

export { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription };
