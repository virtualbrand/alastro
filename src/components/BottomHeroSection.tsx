import React from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const BottomHeroSection = () => {
  useScrollAnimation();
  
  return (
  <div id="sobre" className="relative bg-[var(--color-bg-2)] w-full mt-[-5px] z-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Imagem: 100% em mobile/tablet, 50% em desktop com sticky */}
        <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0">
          <img 
            src="/images/nosso-time.jpg" 
            alt="Retrato artístico em preto e branco" 
            className="w-full h-80 lg:h-screen object-cover object-center filter grayscale"
          />
        </div>
        {/* Texto: 100% em mobile/tablet, 50% em desktop */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-10 lg:px-20 xl:px-24 py-16 md:py-20 bg-[var(--color-bg-2)]">
          <h1 className="fade-in text-3xl sm:text-3xl md:text-3xl lg:text-4xl font-amplitude font-bold text-foreground leading-tight uppercase max-w-[800px] mb-8" suppressHydrationWarning>
            Somos uma Produtora Audiovisual apaixonada pelo poder das imagens em movimento
          </h1>
          
          <div className="space-y-6 max-w-[800px]">
            <p className="fade-in text-base sm:text-lg md:text-xl font-amplitude text-foreground leading-relaxed" suppressHydrationWarning>
              Ao longo dos anos, conquistamos a confiança de clientes de diversos setores, trabalhando em projetos que vão desde comerciais e vídeos corporativos até produções cinematográficas e conteúdo para redes sociais.
            </p>
            
            <p className="fade-in text-base sm:text-lg md:text-xl font-amplitude text-foreground leading-relaxed" suppressHydrationWarning>
              Na Alastro, nos comunicamos como <strong>produtora</strong> porque entregamos excelência audiovisual, mas nossa atuação é muito maior.
            </p>
            
            <p className="fade-in text-base sm:text-lg md:text-xl font-amplitude text-foreground leading-relaxed" suppressHydrationWarning>
              Somos uma <strong>Agência 360</strong> que une estratégia, criatividade e gestão para impulsionar marcas, fortalecer posicionamentos e transformar comunicação em resultado real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomHeroSection;
