"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/20 text-foreground outline-none transition-colors focus-visible:border-foreground/60 hover:bg-foreground hover:text-[var(--color-bg-2)]";

/** Linhas do depoimento antes do "Ler mais" no mobile, onde o texto não acompanha a altura da foto. */
const MOBILE_MAX_LINES = 7;

/** Espaço do bloco de texto que não é o depoimento: nome (com margem) + linha do "Ler mais". */
const TEXT_CHROME_HEIGHT = 56 + 44;

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  // A altura só anima ao abrir/fechar o "Ler mais". Na troca de depoimento ela muda de uma vez,
  // enquanto o texto está invisível; animar aí fazia o conteúdo deslizar para cima/baixo.
  const [heightDuration, setHeightDuration] = useState(0);
  const [isClamped, setIsClamped] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [photoHeight, setPhotoHeight] = useState(0);
  const [textHeight, setTextHeight] = useState<number | null>(null);
  // Refs em state: com o AnimatePresence em "wait" o elemento é trocado depois do fade-out.
  const [textEl, setTextEl] = useState<HTMLDivElement | null>(null);
  const [quoteEl, setQuoteEl] = useState<HTMLParagraphElement | null>(null);
  const [photoEl, setPhotoEl] = useState<HTMLDivElement | null>(null);

  const select = (next: number) => {
    setHeightDuration(0);
    setExpanded(false);
    setActive(next);
  };
  const handleNext = () => select((active + 1) % testimonials.length);
  const handlePrev = () => select((active - 1 + testimonials.length) % testimonials.length);

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, active]);

  // Breakpoint md: a partir dele o texto acompanha a altura da foto.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Altura da foto (quadrado de até 500px): referência para o bloco de texto.
  useEffect(() => {
    if (!photoEl) return;
    const update = () => setPhotoHeight(photoEl.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(photoEl);
    return () => observer.disconnect();
  }, [photoEl]);

  // Altura natural do depoimento atual, para animar a altura do bloco.
  useEffect(() => {
    if (!textEl) return;
    const update = () => setTextHeight(textEl.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(textEl);
    return () => observer.disconnect();
  }, [textEl]);

  // Quantas linhas do depoimento cabem na altura da foto, depois do nome e do "Ler mais".
  const lineHeight = quoteEl ? parseFloat(getComputedStyle(quoteEl).lineHeight) || 28 : 28;
  const maxLines = isDesktop
    ? Math.max(3, Math.floor((photoHeight - TEXT_CHROME_HEIGHT) / lineHeight))
    : MOBILE_MAX_LINES;

  // Só mostra o "Ler mais" quando o texto realmente é cortado.
  useLayoutEffect(() => {
    if (!quoteEl || expanded) return;
    setIsClamped(quoteEl.scrollHeight > quoteEl.clientHeight + 1);
  }, [quoteEl, expanded, maxLines, active]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const onDragEnd = (_: unknown, { offset, velocity }: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  // No desktop o bloco tem, no mínimo, a altura da foto (conteúdo centralizado); expandido, cresce.
  const boxHeight =
    textHeight === null ? "auto" : isDesktop ? Math.max(photoHeight, textHeight) : textHeight;

  // Centraliza na vertical só enquanto o texto é menor que a foto; maior que ela, ancora no topo.
  const topPadding =
    isDesktop && textHeight !== null ? Math.max(0, (photoHeight - textHeight) / 2) : 0;

  const arrowButtons = (
    <>
      <button type="button" onClick={handlePrev} aria-label="Depoimento anterior" className={arrowClass}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={handleNext} aria-label="Próximo depoimento" className={arrowClass}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </>
  );

  return (
    <div className={cn("max-w-4xl md:max-w-7xl mx-auto px-4 md:px-8 lg:px-12", className)}>
      <div className="relative grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col gap-6">
          <motion.div
            ref={setPhotoEl}
            className="relative aspect-square w-full max-w-[500px]"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={onDragEnd}
          >
            {/* Todas as fotos ficam empilhadas; a troca é só um fade de opacidade. */}
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={false}
                animate={{ opacity: isActive(index) ? 1 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0"
                style={{ zIndex: isActive(index) ? 2 : 1, pointerEvents: isActive(index) ? "auto" : "none" }}
                aria-hidden={!isActive(index)}
              >
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full rounded-2xl object-cover shadow-xl grayscale-[0.2] brightness-110"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Desktop: setas centralizadas em relação à foto. No mobile ficam na linha do nome (abaixo). */}
          <div className="hidden w-full max-w-[500px] justify-center gap-2 md:flex">{arrowButtons}</div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={onDragEnd}
        >
          {/* Bloco com a altura da foto, conteúdo centralizado na vertical; o "Ler mais" o expande. */}
          <motion.div
            initial={false}
            animate={{ height: boxHeight }}
            transition={{ duration: heightDuration, ease: "easeInOut" }}
            className="relative overflow-hidden"
            style={{ paddingTop: topPadding }}
          >
            {/* Mobile: setas na linha do nome. Ficam fora do bloco que faz fade para não piscarem a cada troca. */}
            <div className="absolute right-0 top-0 z-10 flex gap-2 md:hidden">{arrowButtons}</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                ref={setTextEl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <h3 className="flex min-h-10 items-center pr-24 text-2xl font-amplitude font-bold text-foreground md:min-h-0 md:pr-0 md:text-3xl">
                  {testimonials[active].name}
                </h3>
                {testimonials[active].designation && (
                  <p className="text-paragraph font-amplitude text-muted-foreground">
                    {testimonials[active].designation}
                  </p>
                )}
                <p
                  ref={setQuoteEl}
                  className="text-paragraph font-amplitude text-muted-secondary mt-4"
                  style={
                    expanded
                      ? undefined
                      : {
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: maxLines,
                          overflow: "hidden",
                        }
                  }
                >
                  {testimonials[active].quote}
                </p>
                {(isClamped || expanded) && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeightDuration(0.5);
                      setExpanded((value) => !value);
                    }}
                    aria-expanded={expanded}
                    className="mt-3 text-sm font-bold uppercase tracking-wide text-foreground underline underline-offset-4 outline-none transition-colors hover:text-[var(--color-menu-hover)]"
                  >
                    {expanded ? "Ler menos" : "Ler mais"}
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
