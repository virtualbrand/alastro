import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook otimizado para detecção de visibilidade
 * Mais performático que bibliotecas externas
 */
export function useInView({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Se já foi visto e triggerOnce está ativo, não precisa observar mais
    if (triggerOnce && hasBeenInView) {
      setIsInView(true);
      return;
    }

    // Fallback para navegadores sem suporte
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        setIsInView(inView);
        
        if (inView && triggerOnce) {
          setHasBeenInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasBeenInView]);

  return { ref, isInView };
}
