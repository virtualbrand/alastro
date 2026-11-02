"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tip } from "@/components/ui/tip";

/** Ícone de copiar com confirmação discreta ("Link copiado") por 2 segundos. */
export const CopyLinkButton = ({
  value,
  onError,
}: {
  value: string;
  onError?: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      onError?.();
    }
  };

  return (
    <>
      <Tip label={"Copiar link"}>
        <button
          type="button"
          onClick={copy}

          aria-label="Copiar link"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors hover:text-foreground"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[hsl(var(--primary-ink))]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </Tip>
      <span
        role="status"
        className={cn(
          "font-bold text-[hsl(var(--primary-ink))] transition-opacity duration-200",
          copied ? "opacity-100" : "opacity-0",
        )}
      >
        {copied ? "Link copiado" : ""}
      </span>
    </>
  );
};
