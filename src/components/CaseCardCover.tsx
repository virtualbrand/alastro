"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CaseCardCoverProps {
  coverUrl: string | null;
  hoverVideoWebmUrl: string | null;
  hoverVideoMp4Url: string | null;
  className?: string;
}

interface Candidate {
  url: string;
  type: string;
}

/** Quanto esperar o primeiro quadro de um formato antes de tentar o outro. */
const LOAD_TIMEOUT_MS = 4000;
const HEAD_TIMEOUT_MS = 1500;

/** Tamanhos já medidos por URL: evita refazer o HEAD a cada card ou hover. */
const sizeCache = new Map<string, Promise<number | null>>();

const fetchSize = (url: string): Promise<number | null> => {
  const cached = sizeCache.get(url);
  if (cached) return cached;

  const request = (async () => {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(HEAD_TIMEOUT_MS),
      });
      const length = Number(response.headers.get("content-length"));
      return response.ok && length > 0 ? length : null;
    } catch {
      return null;
    }
  })();
  sizeCache.set(url, request);
  return request;
};

/**
 * Formatos que o navegador toca, do que tende a carregar primeiro ao que
 * tende a carregar depois: o de menor tamanho. Sem tamanho conhecido, WebM
 * na frente (costuma ser menor), depois MP4.
 */
const rankCandidates = async (
  video: HTMLVideoElement,
  webm: string | null,
  mp4: string | null,
): Promise<Candidate[]> => {
  const all: Candidate[] = [];
  if (webm) all.push({ url: webm, type: "video/webm" });
  if (mp4) all.push({ url: mp4, type: "video/mp4" });

  const playable = all.filter((c) => video.canPlayType(c.type) !== "");
  const sizes = await Promise.all(playable.map((c) => fetchSize(c.url)));

  return playable
    .map((candidate, index) => ({ candidate, index, size: sizes[index] }))
    .sort(
      (a, b) =>
        (a.size ?? Number.MAX_SAFE_INTEGER) -
          (b.size ?? Number.MAX_SAFE_INTEGER) || a.index - b.index,
    )
    .map(({ candidate }) => candidate);
};

/**
 * Capa do card de case. No hover (do `.group` mais próximo) toca um vídeo
 * curto por cima da capa:
 *
 * - Usa primeiro o formato mais leve (WebM ou MP4, o que o navegador toca e
 *   tem menos bytes) e, se não carregar ou demorar, tenta o outro.
 * - A capa só some quando o vídeo de fato começa a tocar. Se nenhum
 *   formato carregar, a capa continua visível.
 * - Nada é baixado antes do primeiro hover.
 */
export const CaseCardCover = ({
  coverUrl,
  hoverVideoWebmUrl,
  hoverVideoMp4Url,
  className,
}: CaseCardCoverProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(hoverVideoWebmUrl || hoverVideoMp4Url);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const card = video?.closest(".group");
    if (!video || !card) return;

    let state: "idle" | "loading" | "ready" | "failed" = "idle";
    let hovering = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const clear = () => {
      clearTimeout(timer);
      video.onerror = null;
      video.onloadeddata = null;
    };

    const attempt = (order: Candidate[], index: number) => {
      if (disposed) return;
      clear();
      if (index >= order.length) {
        state = "failed";
        setPlaying(false);
        return;
      }

      const next = () => attempt(order, index + 1);
      video.onerror = next;
      video.onloadeddata = () => {
        clear();
        state = "ready";
        if (hovering) start();
      };
      timer = setTimeout(next, LOAD_TIMEOUT_MS);

      video.src = order[index].url;
      video.load();
    };

    const start = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    };

    const stop = () => {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
    };

    const onEnter = async () => {
      hovering = true;
      if (state === "ready") return start();
      if (state !== "idle") return;

      state = "loading";
      const order = await rankCandidates(
        video,
        hoverVideoWebmUrl,
        hoverVideoMp4Url,
      );
      attempt(order, 0);
    };
    const onLeave = () => {
      hovering = false;
      if (state === "ready") stop();
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("focusin", onEnter);
    card.addEventListener("focusout", onLeave);
    return () => {
      disposed = true;
      clear();
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("focusin", onEnter);
      card.removeEventListener("focusout", onLeave);
    };
  }, [hasVideo, hoverVideoWebmUrl, hoverVideoMp4Url]);

  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--color-surface)]",
        className,
      )}
    >
      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {hasVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          // Só aparece quando está tocando; antes disso (ou se falhar) a capa fica à vista.
          className={cn(
            "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300",
            playing && "opacity-100",
          )}
        />
      )}
    </div>
  );
};
