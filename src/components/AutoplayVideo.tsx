"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceMediaClip } from "@/content/service-media";

/**
 * Clip decorativo em loop, sem som e sem interação (autoplay, sem hover).
 *
 * - Só carrega quando chega perto da tela (nada de baixar cinco vídeos ao abrir a página).
 * - Pausa fora da tela, para não gastar CPU/bateria com vídeo que ninguém vê.
 * - Com "reduzir movimento" no sistema, não toca: fica no primeiro quadro.
 */
const AutoplayVideo = ({ clip, className }: { clip: ServiceMediaClip; className?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const visible = useRef(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Carrega um pouco antes de entrar na tela; toca/pausa conforme a visibilidade.
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "300px 0px" }
    );
    const player = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (reduceMotion.current) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    loader.observe(video);
    player.observe(video);

    return () => {
      loader.disconnect();
      player.disconnect();
    };
  }, []);

  // Quando as fontes entram no DOM, o vídeo precisa ser recarregado para usá-las.
  useEffect(() => {
    const video = ref.current;
    if (!near || !video) return;
    video.load();
    // O load() zera o elemento: se já está na tela, retoma a reprodução.
    if (visible.current && !reduceMotion.current) video.play().catch(() => {});
  }, [near]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    >
      {near && (
        <>
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </>
      )}
    </video>
  );
};

export default AutoplayVideo;
