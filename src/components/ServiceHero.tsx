"use client";

import React, { lazy, Suspense } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";

// Mesmo efeito da hero da home, carregado só quando necessário.
const CursorDitherTrail = lazy(() => import("@/components/ui/cursor-dither-trail"));


interface ServiceHeroProps {
  breadcrumb: BreadcrumbItem[];
  /** Ícone já renderizado: componentes não atravessam a fronteira servidor→cliente. */
  icon?: React.ReactNode;
  name: string;
  headline: string;
  /** Linha pequena acima do título (ex.: nome do cliente). */
  eyebrow?: string;
  /** Conteúdo extra abaixo do texto de apoio (ex.: etiquetas). */
  children?: React.ReactNode;
  /**
   * Mídia que ocupa a metade direita da hero. Com ela, o fundo é a cor lisa do marrom (sem o
   * padrão de pixels, que apareceria ao redor do vídeo). O rastro do mouse continua.
   * No mobile ela vem abaixo do texto.
   */
  media?: React.ReactNode;
  /** Liga o `.fade-in` ao rolar (precisa de `useScrollAnimation` na página, ex.: via Footer). */
  fadeIn?: boolean;
}

/** Hero de /servicos e das páginas de serviço: mesmo fundo e efeito de cursor da hero da home. */
const ServiceHero = ({ breadcrumb, icon, name, headline, eyebrow, children, media, fadeIn = false }: ServiceHeroProps) => {
  const fade = fadeIn ? "fade-in " : "";
  const sectionRef = React.useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className={`relative bg-cover bg-[position:10%_center] md:bg-center bg-no-repeat before:content-[''] before:block before:absolute before:inset-0 before:bg-black/10 pt-16 overflow-hidden ${
        media ? "flex flex-col md:block md:h-[600px]" : "h-[600px]"
      }`}
      style={media ? { backgroundColor: "var(--color-bg-3)" } : { backgroundImage: "url('/images/hero-bg.avif')" }}
    >
      <Suspense fallback={null}>
        <CursorDitherTrail
          className="absolute inset-0 w-full h-full z-10"
          trailColor="#d4ec8e"
          dotSize={6}
          fadeDuration={2200}
          containerRef={sectionRef}
        />
      </Suspense>

      {media && (
        <div className="relative z-20 order-2 aspect-video w-full bg-[var(--color-surface)] md:absolute md:bottom-0 md:right-0 md:top-16 md:order-none md:aspect-auto md:w-1/2">
          {media}
        </div>
      )}

      <div
        className={`relative z-20 flex w-full items-center px-6 md:px-12 lg:px-20 xl:px-24 ${
          media ? "pointer-events-none py-12 md:h-full md:py-0" : "h-full"
        }`}
      >
        {/* O padrão de pixels verdes ocupa a metade direita do fundo: a coluna de
            texto para no centro da tela, então fica sempre sobre o marrom. */}
        <div className={`w-full md:max-w-[50%] ${media ? "pointer-events-auto" : ""}`}>
          <Breadcrumb items={breadcrumb} className="mb-5 text-foreground md:mb-8" />

          {/* Ícone e título formam um grupo (12px); o breadcrumb fica mais afastado. */}
          {icon && <div className="mb-3">{icon}</div>}

          {eyebrow && (
            <p className={`${fade}mb-3 text-xs font-bold uppercase tracking-wide text-foreground/70 font-amplitude`}>
              {eyebrow}
            </p>
          )}

          <h1 className={`${fade}text-3xl md:text-4xl lg:text-5xl font-amplitude font-bold text-foreground leading-tight uppercase`}>
            {name}
          </h1>

          <p className={`${fade}mt-4 text-paragraph font-amplitude text-foreground md:mt-5`}>
            {headline}
          </p>

          {children}
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
