import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const targetTop = () =>
      element.getBoundingClientRect().top + window.scrollY;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, targetTop());
      return;
    }

    // Animação própria em vez de scrollIntoView({ behavior: 'smooth' }): o
    // scroll nativo é cancelado por mudanças de layout durante o trajeto
    // (menu fechando, seções carregando sob demanda), e no celular isso fazia
    // o clique no menu não rolar a página. Aqui o destino é recalculado a
    // cada quadro.
    const startY = window.scrollY;
    const duration = 700;
    const startTime = performance.now();
    let cancelled = false;

    const cancel = () => {
      cancelled = true;
    };
    // Se o usuário tocar ou rolar durante a animação, ele assume o controle.
    window.addEventListener('wheel', cancel, { once: true, passive: true });
    window.addEventListener('touchstart', cancel, { once: true, passive: true });

    const step = (now: number) => {
      if (cancelled) return;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startY + (targetTop() - startY) * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
      }
    };

    requestAnimationFrame(step);
  }, []);

  const handleAnchorClick = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Se o href é uma âncora (começa com #)
    if (href.startsWith('#')) {
      e.preventDefault();
      const elementId = href.substring(1); // Remove o #
      scrollToElement(elementId);
    }
    // Se não é uma âncora, deixa o comportamento padrão
  }, [scrollToElement]);

  return { scrollToElement, handleAnchorClick };
};