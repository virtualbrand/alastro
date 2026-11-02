"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";
const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

/**
 * Sobe um arquivo para o bucket público e devolve a URL servível.
 * O nome é randomizado para evitar colisão e não expor o nome original.
 */
export const uploadImage = async (
  file: File,
  folder = "cases",
): Promise<string> => {
  if (!ACCEPTED.includes(file.type)) {
    throw new UploadError("Formato não aceito. Use JPG, PNG, WebP ou AVIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("Arquivo acima de 8 MB. Comprima antes de subir.");
  }
  return uploadFile(
    file,
    folder,
    "Não foi possível enviar a imagem. Tente novamente em instantes.",
  );
};

export type VideoFormat = "mp4" | "webm";

const VIDEO_MIME: Record<VideoFormat, string> = {
  mp4: "video/mp4",
  webm: "video/webm",
};
const VIDEO_MAX_BYTES = 20 * 1024 * 1024;

/** Sobe um vídeo curto (mp4 ou webm) para o mesmo bucket. */
export const uploadVideo = async (
  file: File,
  format: VideoFormat,
  folder = "cases",
): Promise<string> => {
  if (file.type !== VIDEO_MIME[format]) {
    throw new UploadError(`Formato não aceito. Envie um arquivo .${format}.`);
  }
  if (file.size > VIDEO_MAX_BYTES) {
    throw new UploadError("Arquivo acima de 20 MB. Comprima antes de subir.");
  }
  return uploadFile(
    file,
    folder,
    "Não foi possível enviar o vídeo. Tente novamente em instantes.",
  );
};

const uploadFile = async (
  file: File,
  folder: string,
  failureMessage: string,
): Promise<string> => {
  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) {
    throw new UploadError(failureMessage);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
};
