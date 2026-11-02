"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastKind = "success" | "error";

export interface ToastData {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
}

const DURATION: Record<ToastKind, number> = { success: 4000, error: 6000 };

/** Rolagem horizontal (px) acima da qual soltar o aviso o dispensa. */
const DISMISS_DISTANCE = 80;
/** Sem novo evento de rolagem por este tempo, o gesto é considerado terminado. */
const GESTURE_END_MS = 160;
const MAX_OFFSET = 320;

/**
 * Um aviso da pilha de notificações. Some sozinho; passar o mouse por cima
 * pausa a contagem. Com o mouse sobre ele, a rolagem horizontal (trackpad ou
 * shift + roda) arrasta o aviso e, passando de certa distância, o dispensa;
 * soltando antes, ele volta ao lugar. Os eventos de ponteiro não sobem: sem
 * isso, clicar aqui com um drawer ou modal aberto seria lido por ele como
 * clique "fora" e fecharia.
 */
export const Toast = ({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
}) => {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Deslocamento do gesto de rolagem; `tracking` desliga a transição enquanto ele segue o dedo.
  const [offset, setOffset] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let current = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onWheel = (event: WheelEvent) => {
      let dx = event.deltaX;
      if (dx === 0 && event.shiftKey) dx = event.deltaY;
      else if (Math.abs(event.deltaY) > Math.abs(dx)) return;
      if (dx === 0) return;
      if (event.deltaMode === 1) dx *= 16;

      // Sem cancelar, o gesto lateral viraria "voltar página" no navegador.
      event.preventDefault();

      // Segue o gesto: arrastar para a direita move o aviso para a direita.
      current = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, current - dx));
      setTracking(true);
      setOffset(current);

      clearTimeout(timer);
      timer = setTimeout(() => {
        setTracking(false);
        if (Math.abs(current) >= DISMISS_DISTANCE) {
          setLeaving(true);
          setOffset(Math.sign(current) * 480);
          setTimeout(() => onDismiss(toast.id), 200);
        } else {
          current = 0;
          setOffset(0);
        }
      }, GESTURE_END_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      clearTimeout(timer);
      el.removeEventListener("wheel", onWheel);
    };
  }, [onDismiss, toast.id]);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => onDismiss(toast.id), DURATION[toast.kind]);
    return () => clearTimeout(timer);
  }, [paused, toast.id, toast.kind, onDismiss]);

  const isError = toast.kind === "error";

  return (
    <div
      ref={ref}
      role={isError ? "alert" : "status"}
      style={{
        transform: offset ? `translateX(${offset}px)` : undefined,
        opacity: leaving ? 0 : 1 - Math.min(Math.abs(offset) / 240, 0.6),
        transition: tracking
          ? "none"
          : "transform 200ms ease-out, opacity 200ms ease-out",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={(e) => e.stopPropagation()}
      className="pointer-events-auto flex w-full animate-toast-in items-start gap-3 rounded-md border border-border bg-card p-4 text-card-foreground shadow-lg"
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white",
          isError ? "bg-destructive" : "bg-[hsl(74_70%_33%)]",
        )}
      >
        {isError ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {toast.description}
          </p>
        )}
      </div>

      <button
        type="button"
        tabIndex={-1}
        // Sem foco no botão: o foco saindo do drawer também o fecharia.
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar aviso"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
