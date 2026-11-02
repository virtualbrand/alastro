"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Toast,
  type ToastData,
  type ToastKind,
} from "@/components/ui/notify-toast";

interface Notify {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const NotifyContext = createContext<Notify | null>(null);

const MAX_VISIBLE = 4;

/**
 * Notificações do painel, no canto superior direito. Fica no layout do
 * dashboard: o aviso sobrevive à navegação (ex.: salvar um post volta para a
 * lista) e aparece por cima de drawers e modais.
 */
export const NotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, title: string, description?: string) => {
      const toast = { id: crypto.randomUUID(), kind, title, description };
      setToasts((list) => [...list, toast].slice(-MAX_VISIBLE));
    },
    [],
  );

  const notify = useMemo<Notify>(
    () => ({
      success: (title, description) => push("success", title, description),
      error: (title, description) => push("error", title, description),
    }),
    [push],
  );

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      {mounted &&
        createPortal(
          // `painel`: fora da árvore do painel (portal), precisa dos mesmos tokens de tema.
          // Com um modal aberto o body fica sem ponteiro; cada aviso o reativa.
          <div
            aria-live="polite"
            className="painel pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 bg-transparent"
          >
            {toasts.map((toast) => (
              <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
          </div>,
          document.body,
        )}
    </NotifyContext.Provider>
  );
};

export const useNotify = (): Notify => {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error("useNotify precisa estar dentro de <NotifyProvider>.");
  }
  return context;
};
