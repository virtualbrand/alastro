import { useEffect, useRef, useState } from "react";
import { TextRevealByWord } from "@/components/ui/text-reveal";

const ManifestoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [bgOpacity, setBgOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = 0;
      const mid = rect.height / 2;
      const fadeOutStart = Math.min(windowHeight / 2, rect.height - windowHeight / 2);

      // Deixe o fade-out mais acelerado: reduza o divisor
      const fadeOutEnd = fadeOutStart + (fadeOutStart * 0.1); // 40% do fadeOutStart

      let progress = 0;
      if (rect.top >= start && rect.top <= mid) {
        // Fade-in
        progress = Math.min(
          Math.max((windowHeight - rect.top - start) / (mid - start), 0),
          1
        );
      } else if (rect.top < start && rect.bottom > fadeOutStart) {
        // Travado (opacidade máxima)
        progress = 1;
      } else if (rect.bottom <= fadeOutStart && rect.bottom >= 0) {
        // Fade-out mais acelerado
        progress = Math.max(
          (rect.bottom - 0) / (fadeOutEnd - 0),
          0
        );
      }
      setBgOpacity(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="bg-background relative flex justify-center items-center manifesto-section"
      style={{
        backgroundImage: "url('/images/manifesto-bg.webp')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "400px",
        transition: "background 0.3s, opacity 0.3s",
        opacity: bgOpacity,
      }}
    >
      <style>{`
        @media (min-width: 1024px) {
          .manifesto-section {
            background-attachment: fixed !important;
            background-size: auto !important;
          }
        }
      `}</style>
      <TextRevealByWord
        className="uppercase text-center font-amplitude max-w-5xl"
        text="Espalhar ou propagar, Encher ou invadir, Pôr lastro em, Carregar com lastro"
      />
    </section>
  );
};

export default ManifestoSection;