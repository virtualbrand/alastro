"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileDrop } from "@/hooks/use-file-drop";
import { uploadImage, UploadError } from "@/services/storageService";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  folder?: string;
  hint?: string;
  /** Área 1:1 em vez da faixa de 192px de altura. */
  square?: boolean;
  /** Esconde o rótulo e o texto de formatos (use com o rótulo e a dica por fora). */
  compact?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  label,
  folder = "cases",
  hint,
  square = false,
  compact = false,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isDragging, dropProps } = useFileDrop(
    (files) => handleFile(files[0]),
    { disabled: isUploading },
  );

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(
        err instanceof UploadError
          ? err.message
          : "Não foi possível enviar a imagem.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {!compact && (
        <span className="block text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
      )}

      <div {...dropProps} className="relative">
        {value ? (
          <div className="relative overflow-hidden rounded-md border border-border">
            {/* Imagem vinda do Storage: <img> evita configurar remotePatterns */}
            <img
              src={value}
              alt=""
              className={cn(
                "w-full bg-muted object-cover",
                square ? "aspect-square" : "h-48",
              )}
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remover imagem"
              className={cn(
                "absolute flex items-center justify-center rounded-full bg-background/90 text-foreground shadow transition-colors hover:bg-destructive hover:text-destructive-foreground",
                // Compacto (foto de 140px): botão menor, no mesmo canto superior direito.
                compact ? "right-1.5 top-1.5 h-6 w-6" : "right-2 top-2 h-8 w-8",
              )}
            >
              <X className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border px-2 text-center text-muted-foreground transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-foreground disabled:opacity-60",
              square ? "aspect-square" : "h-48",
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Enviando...</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-6 w-6" />
                <span className={compact ? "text-xs" : "text-sm"}>
                  Escolher imagem
                </span>
                {!compact && (
                  <span className="text-xs">
                    JPG, PNG, WebP ou AVIF até 8 MB
                  </span>
                )}
              </>
            )}
          </button>
        )}
        {isDragging && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md border-2 border-dashed border-[hsl(var(--primary-ink))] bg-background/85 text-center text-xs font-bold text-[hsl(var(--primary-ink))]"
          >
            Solte para enviar
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
