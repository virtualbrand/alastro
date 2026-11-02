"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CaseCardCover } from "@/components/CaseCardCover";
import { toEmbedUrl } from "@/lib/video";
import type { HomeCase } from "@/lib/cases-queries";

/** Quantos serviços aparecem como etiqueta no modal; o resto vira "+N". */
const MAX_SERVICE_TAGS = 3;

/**
 * Card de case da home (a classe `fade-in` liga a animação de entrada ao rolar,
 * feita pelo useScrollAnimation das seções que o usam), com o mesmo visual dos
 * cards de "Nossos trabalhos em ação": capa, vídeo no hover (formato mais leve
 * primeiro, capa como reserva) e botão de play.
 *
 * Ao clicar abre um modal com o vídeo e o contexto do projeto (cliente, resumo,
 * serviços) e um botão para a página completa do case. O iframe só existe com o
 * modal aberto, então nada de YouTube é carregado antes disso; usa o domínio
 * `youtube-nocookie` para não gravar cookies de quem só abriu o vídeo.
 */
export const HomeCaseCard = ({ item }: { item: HomeCase }) => {
  const embed = toEmbedUrl(item.video_url);
  const caseHref = `/cases/${item.slug}`;

  const card = (
    <div className="group relative aspect-[3/2] w-full cursor-pointer overflow-hidden">
      <CaseCardCover
        coverUrl={item.cover_url}
        hoverVideoWebmUrl={item.hover_video_webm_url}
        hoverVideoMp4Url={item.hover_video_mp4_url}
        className="absolute inset-0 aspect-auto rounded-none bg-transparent"
      />
      <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 md:h-16 md:w-16">
          <Play className="h-6 w-6 fill-white text-white md:h-8 md:w-8" />
        </div>
        <h3 className="px-4 text-center font-amplitude text-sm font-semibold leading-normal text-white md:text-base">
          {item.title}
        </h3>
      </div>
    </div>
  );

  // Sem vídeo reconhecido para abrir no modal, o card leva à página do case.
  if (!embed) {
    return (
      <Link
        href={caseHref}
        aria-label={item.title}
        className="fade-in block"
        suppressHydrationWarning
      >
        {card}
      </Link>
    );
  }

  // `?? []`: a página é gerada com revalidação, e uma cópia antiga em cache pode não trazer serviços.
  const services = item.services ?? [];
  const tags = services.slice(0, MAX_SERVICE_TAGS);
  const extraTags = services.length - tags.length;
  const src = `${embed.replace("www.youtube.com", "www.youtube-nocookie.com")}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Assistir vídeo: ${item.title}`}
          className="fade-in relative block w-full border-0 bg-transparent p-0 text-left"
          suppressHydrationWarning
        >
          {card}
        </button>
      </DialogTrigger>

      <DialogContent
        // Fundo grafite próprio: o `bg-background` do diálogo é claro no site público.
        className="max-h-[92vh] max-w-4xl gap-0 overflow-y-auto border-[var(--color-border-form)] bg-[var(--color-bg)] p-0"
        {...(item.summary ? {} : { "aria-describedby": undefined })}
      >
        <div className="aspect-video w-full bg-black">
          <iframe
            className="size-full"
            src={src}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col gap-6 p-6 font-amplitude md:flex-row md:items-end md:justify-between md:gap-8 md:p-8">
          <div className="min-w-0 space-y-3">
            {item.client && (
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-accent-green)]">
                {item.client}
              </p>
            )}
            <DialogTitle className="text-2xl font-bold leading-tight text-[var(--color-heading)] md:text-3xl">
              {item.title}
            </DialogTitle>
            {item.summary && (
              <DialogDescription className="line-clamp-3 text-sm text-[var(--color-text-primary)] opacity-80 md:text-base">
                {item.summary}
              </DialogDescription>
            )}
            {tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-1">
                {tags.map((service) => (
                  <li
                    key={service}
                    className="rounded-full border border-[var(--color-border-form)] px-3 py-1 text-xs text-[var(--color-text-primary)]"
                  >
                    {service}
                  </li>
                ))}
                {extraTags > 0 && (
                  <li className="rounded-full border border-[var(--color-border-form)] px-3 py-1 text-xs text-[var(--color-text-primary)] opacity-70">
                    +{extraTags}
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Chamada genérica, no vocabulário de /sobre (viver e contar histórias). */}
          <div className="flex shrink-0 flex-col gap-3 md:items-end md:text-right">
            <p className="text-base font-bold leading-snug text-[var(--color-heading)]">
              Quer viver essa história por dentro?
            </p>
            <Link
              href={caseHref}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-accent-green)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#25282a] transition-opacity hover:opacity-90"
            >
              Conheça a história completa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
