import React, { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// Lazy load do efeito pesado - só carrega quando necessário
const CursorDitherTrail = lazy(() => import("@/components/ui/cursor-dither-trail"));

const HeroSection = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollToElement } = useSmoothScroll();

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[calc(100vh)] h-[calc(100vh)] bg-cover bg-center bg-no-repeat bg-[url('/images/hero-bg.png')] before:content-[''] before:block before:absolute before:inset-0 before:bg-black/10 pt-16 overflow-hidden"
      style={{ contentVisibility: 'auto' }}
    >
      {/* Cursor Dither Trail Effect - Lazy loaded */}
      <Suspense fallback={null}>
        <CursorDitherTrail
          className="absolute inset-0 w-full h-full z-10"
          trailColor="#d4ec8e"
          dotSize={6}
          fadeDuration={1000}
          containerRef={sectionRef}
        />
      </Suspense>
      
      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center mx-auto px-4 sm:px-6 md:px-8 container">
        <div className="w-full">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-amplitude font-bold text-foreground leading-tight uppercase max-w-[800px]">
              <span className="block">REGISTRANDO HISTÓRIAS</span>
              <span className="block">QUE CONECTAM</span>
              <span className="block">E IMPACTAM</span>
            </h2>
            
            <Button 
              onClick={() => scrollToElement('sobre')}
              className="group/button relative inline-flex justify-center items-center overflow-hidden rounded-md bg-[var(--color-accent-green)] px-8 py-6 text-lg font-amplitude font-bold text-[var(--color-text-secondary)] uppercase transition-all duration-300 ease-in-out hover:bg-[var(--color-accent-green)]/80 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl px-2 py-1 font-amplitude">SAIBA MAIS</span>
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;