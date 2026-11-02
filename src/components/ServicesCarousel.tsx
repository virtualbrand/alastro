"use client";

import React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselService {
  slug: string;
  name: string;
  summary: string;
  /** Ícone já renderizado: componentes não atravessam a fronteira servidor→cliente. */
  icon: React.ReactNode;
}

/**
 * Carrossel de serviços. Todos os links ficam no HTML (o scroll é só visual),
 * então os rastreadores enxergam cada serviço mesmo fora da área visível.
 */
/** Intervalo entre um avanço e outro do autoplay. */
const AUTOPLAY_DELAY = 4500;

const ServicesCarousel = ({ items }: { items: CarouselService[] }) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [viewportRef, embla] = useEmblaCarousel({
    // Cada card é alinhado ao recuo da página (--g), e não à borda da tela: é isso que
    // deixa os cards já passados continuarem visíveis na margem esquerda.
    align: () => {
      const root = rootRef.current;
      return root ? parseFloat(getComputedStyle(root).getPropertyValue("--g")) || 0 : 0;
    },
    loop: true,
    // Quanto maior, mais lenta e suave a animação de cada avanço (padrão: 25).
    duration: 45,
  });
  const restartAutoplay = React.useRef<() => void>(() => {});
  // Em loop o Embla sempre pode voltar; a seta esquerda só vale depois do
  // primeiro movimento, para o carrossel não parecer começar "no meio".
  const [hasMoved, setHasMoved] = React.useState(false);

  React.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setHasMoved(true);
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  // Margem esquerda: antes do primeiro movimento ela fica vazia (com o loop, o último card
  // apareceria ali). O recorte à esquerda diminui junto com o deslocamento do carrossel, quadro
  // a quadro, então a margem se abre exatamente na velocidade em que os cards andam.
  React.useEffect(() => {
    if (!embla) return;
    const viewport = embla.rootNode();
    const location = () => embla.internalEngine().location.get();
    const gutter = () =>
      rootRef.current ? parseFloat(getComputedStyle(rootRef.current).getPropertyValue("--g")) || 0 : 0;

    let origin = location();
    let opened = false;

    const apply = () => {
      const g = gutter();
      let left = g;
      if (opened) {
        left = 0;
      } else {
        const moved = origin - location();
        if (moved >= g) {
          opened = true;
          left = 0;
        } else {
          left = Math.min(g, Math.max(0, g - moved));
        }
      }
      viewport.style.clipPath = `inset(-32px 0 -32px ${left}px)`;
    };
    const reset = () => {
      if (!opened) origin = location();
      apply();
    };

    apply();
    embla.on("scroll", apply).on("reInit", reset);
    return () => {
      embla.off("scroll", apply).off("reInit", reset);
    };
  }, [embla]);

  // Autoplay: pausa com mouse, foco ou arraste, e fora da tela ou da aba.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!embla || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    let hovering = false;
    let focused = false;
    let dragging = false;
    let visible = false;

    const canRun = () =>
      !hovering && !focused && !dragging && visible && !document.hidden;

    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        if (canRun()) embla.scrollNext();
      }, AUTOPLAY_DELAY);
    };
    restartAutoplay.current = start;

    const onEnter = () => (hovering = true);
    const onLeave = () => {
      hovering = false;
      start();
    };
    const onFocusIn = () => (focused = true);
    const onFocusOut = () => {
      focused = false;
      start();
    };
    const onPointerDown = () => (dragging = true);
    const onPointerUp = () => {
      dragging = false;
      start();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    observer.observe(root);

    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    embla.on("pointerDown", onPointerDown).on("pointerUp", onPointerUp);
    start();

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      embla.off("pointerDown", onPointerDown).off("pointerUp", onPointerUp);
    };
  }, [embla]);

  const arrowClass =
    "flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/20 text-foreground outline-none transition-colors focus-visible:border-foreground/60 hover:bg-foreground hover:text-[var(--color-bg-2)] disabled:pointer-events-none disabled:opacity-30";

  return (
    <div ref={rootRef} className="[--g:24px] md:[--g:48px] lg:[--g:80px] xl:[--g:96px]">
      {/* --g é o recuo lateral da página (o mesmo do header e do rodapé): o carrossel invade essa margem à direita. */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 id="other-services-title" className="text-2xl font-bold text-foreground">
          Outras áreas de atuação
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              embla?.scrollPrev();
              restartAutoplay.current();
            }}
            disabled={!hasMoved}
            aria-label="Serviços anteriores"
            className={arrowClass}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              embla?.scrollNext();
              restartAutoplay.current();
            }}
            aria-label="Próximos serviços"
            className={arrowClass}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        // O overflow-hidden do carrossel corta a sombra do hover; o padding
        // vertical dá espaço para ela e a margem negativa devolve o layout.
        // As margens laterais negativas estendem a área visível até as bordas da tela
        // ("efeito Netflix"): o card seguinte aparece cortado à direita e, depois do
        // primeiro movimento, os já passados aparecem cortados à esquerda.
        className="-mx-[var(--g)] -my-8 overflow-hidden py-8"
        // Valor inicial: margem esquerda escondida. Depois, o effect do carrossel atualiza o
        // clip-path a cada quadro da animação (ver "Margem esquerda" acima).
        style={{ clipPath: "inset(-32px 0 -32px var(--g))" }}
        role="region"
        aria-roledescription="carrossel"
        aria-labelledby="other-services-title"
      >
        <ul className="flex -ml-4">
          {items.map((item) => (
            <li
              key={item.slug}
              className="min-w-0 shrink-0 grow-0 basis-[calc((100%_-_2*var(--g))/2)] pl-4 md:basis-[calc((100%_-_2*var(--g))/3)] lg:basis-[calc((100%_-_2*var(--g))/4)]"
            >
              <Link
                href={`/servicos/${item.slug}`}
                className="group relative block h-full rounded-2xl bg-white/95 p-4 pb-12 transition-shadow md:p-8 md:pb-14 duration-500 ease-out hover:shadow-lg"
              >
                <div className="space-y-2">
                  <span className="mb-4 flex h-10 w-10 items-center md:mb-5 md:h-12 md:w-12 justify-center rounded-xl bg-[var(--color-bg)] text-white transition-colors duration-500 ease-out group-hover:text-[var(--color-accent-green)]">
                    {item.icon}
                  </span>
                  <h3 className="break-words text-sm font-bold text-foreground md:text-lg">{item.name}</h3>
                  <p className="text-xs text-foreground opacity-80 md:text-sm">{item.summary}</p>
                </div>
                <ArrowUpRight className="absolute bottom-3 right-3 h-5 w-5 md:bottom-5 md:right-5 text-foreground transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-menu-hover)] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServicesCarousel;
