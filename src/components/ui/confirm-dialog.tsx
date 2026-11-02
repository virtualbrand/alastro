"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Ação irreversível: pinta de vermelho e mostra o ícone de alerta. */
  destructive?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
}

/**
 * Confirmação no padrão visual do painel, no lugar do window.confirm.
 *
 * O nativo não aceita estilo, exibe "localhost:3000 says" e trava a aba
 * inteira. O Radix cuida de foco preso no diálogo, Escape, clique fora e
 * dos papéis de acessibilidade.
 */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <div className="flex gap-4">
        {destructive && (
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15"
          >
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </span>
        )}

        <div className="min-w-0 space-y-2">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <AlertDialogCancel disabled={isPending}>
          {cancelLabel}
        </AlertDialogCancel>

        <AlertDialogAction
          disabled={isPending}
          // A confirmação é tratada aqui; fechar fica a cargo de quem chama,
          // para o diálogo poder mostrar o estado de carregando.
          onClick={(e) => {
            e.preventDefault();
            onConfirm();
          }}
          className={cn(
            destructive &&
              "bg-destructive text-destructive-foreground hover:opacity-90"
          )}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {confirmLabel}
        </AlertDialogAction>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);
