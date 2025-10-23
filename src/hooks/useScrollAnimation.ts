import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  useEffect(() => {
    // Aguardar o DOM estar pronto
    const timer = setTimeout(() => {
      const animations = [
        { selector: ".scroll-bottom", props: { y: 50 } },
        { selector: ".scroll-left", props: { x: -80 } },
        { selector: ".scroll-right", props: { x: 80 } },
        { selector: ".scroll-top", props: { y: -80 } },
        { selector: ".fade-in", props: { y: 0 } }
      ];

      animations.forEach(animation => {
        document.querySelectorAll(animation.selector).forEach(element => {
          gsap.fromTo(element, 
            {
              opacity: 0,
              filter: "blur(10px)",
              ...animation.props,
            },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "top 65%",
                scrub: 1,
                toggleActions: "play reverse play reverse",
              }
            }
          );
        });
      });

      ScrollTrigger.refresh();
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};
