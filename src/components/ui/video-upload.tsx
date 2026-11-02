"use client";

import { useRef, useState } from "react";
import { Film, Loader2, X } from "lucide-react";
import { useFileDrop } from "@/hooks/use-file-drop";
import {
  uploadVideo,
  UploadError,
  type VideoFormat,
} from "@/services/storageService";

interface VideoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  format: VideoFormat;
  folder?: string;
  hint?: string;
}

export const VideoUpload = ({
  value,
  onChange,
  label,
  format,
  folder = "cases",
  hint,
}: VideoUploadProps) => {
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
      onChange(await uploadVideo(file, format, folder));
    } catch (err) {
      setError(
        err instanceof UploadError
          ? err.message
          : "Não foi possível enviar o vídeo.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-bold uppercase tracking-wide">
        {label}
      </span>

      <div {...dropProps} className="relative">
        {value ? (
          <div className="relative overflow-hidden rounded-md border border-border">
            <video
              src={value}
              muted
              loop
              autoPlay
              playsInline
              className="h-48 w-full bg-muted object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remover vídeo"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-foreground disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Enviando...</span>
              </>
            ) : (
              <>
                <Film className="h-6 w-6" />
                <span className="text-sm">Escolher vídeo .{format}</span>
                <span className="text-xs">Até 20 MB</span>
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
        accept={format === "mp4" ? "video/mp4" : "video/webm"}
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
