import React from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const BottomHeroSection = () => {
  useScrollAnimation();
  
  return (
  <div id="sobre" className="relative bg-[var(--color-bg-2)] w-full mt-[-5px] md:min-h-screen z-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col lg:flex-row items-stretch md:h-full">
        {/* Imagem: 100% em mobile/tablet, 50% em desktop */}
        <div className="w-full lg:w-1/2 md:min-h-screen">
          <img 
            src="/images/nosso-time.jpg" 
            alt="Retrato artístico em preto e branco" 
            className="w-full h-80 md:h-full md:min-h-screen object-cover object-center filter grayscale"
          />
        </div>
        {/* Texto: 100% em mobile/tablet, 50% em desktop */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-10 lg:px-20 xl:px-24 py-16 md:py-16 bg-[var(--color-bg-2)]">
          <h1 className="fade-in text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-amplitude font-bold text-foreground leading-tight uppercase max-w-[800px]">
            <span className="block">Somos uma Produtora Audiovisual apaixonada pelo poder das imagens em movimento</span>
          </h1>
          <p className="fade-in mt-6 text-base sm:text-lg md:text-xl font-amplitude text-foreground/80 max-w-[800px]">
            Ao longo dos anos, conquistamos a confiança de clientes de diversos setores, trabalhando em projetos que vão desde comerciais e vídeos corporativos até produções cinematográficas e conteúdo para redes sociais.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BottomHeroSection;
