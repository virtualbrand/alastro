"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { CaseCardCover } from "@/components/CaseCardCover";

interface CaseHeroMediaProps {
  title: string;
  coverUrl: string | null;
  hoverVideoWebmUrl: string | null;
  hoverVideoMp4Url: string | null;
  /** URL de embed (YouTube/Vimeo); sem ela a mídia é só a capa, sem botão de play. */
  embedUrl: string | null;
}

/**
 * Mídia da hero de um case: o mesmo comportamento dos cards (capa, vídeo mp4/webm no hover) com
 * só o ícone de play por cima. O clique troca a capa pelo player; o iframe só existe depois
 * disso e usa `youtube-nocookie`, então nada de YouTube carrega antes.
 */
export const CaseHeroMedia = ({
  title,
  coverUrl,
  hoverVideoWebmUrl,
  hoverVideoMp4Url,
  embedUrl,
}: CaseHeroMediaProps) => {
  const [open, setOpen] = useState(false);

  if (open && embedUrl) {
    const separator = embedUrl.includes("?") ? "&" : "?";
    const src = `${embedUrl.replace("www.youtube.com", "www.youtube-nocookie.com")}${separator}autoplay=1&playsinline=1&rel=0&modestbranding=1`;
    return (
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  const cover = (
    <>
      <CaseCardCover
        coverUrl={coverUrl}
        hoverVideoWebmUrl={hoverVideoWebmUrl}
        hoverVideoMp4Url={hoverVideoMp4Url}
        className="absolute inset-0 aspect-auto rounded-none bg-transparent"
      />
      {embedUrl && (
        <>
          <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30 md:h-16 md:w-16">
              <Play className="h-6 w-6 fill-white text-white md:h-8 md:w-8" />
            </div>
          </div>
        </>
      )}
    </>
  );

  if (!embedUrl) return <div className="group absolute inset-0 overflow-hidden">{cover}</div>;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Assistir vídeo: ${title}`}
      className="group absolute inset-0 block h-full w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0"
    >
      {cover}
    </button>
  );
};
