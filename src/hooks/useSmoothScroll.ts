import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Usar o método scrollIntoView que funcionará bem com o Lenis
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      
      // Alternativa: usar window.scrollTo para um controle mais preciso
      // const offsetTop = element.offsetTop;
      // window.scrollTo({
      //   top: offsetTop - 80, // Ajuste para compensar header fixo
      //   behavior: 'smooth'
      // });
    }
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