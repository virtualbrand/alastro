import React from "react";

const BottomHeroSection = () => {
  return (
  <div id="sobre" className="relative bg-[var(--color-bg-2)] w-full mt-[-5px]">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Imagem: 100% em mobile/tablet, 50% em desktop */}
        <div className="w-full lg:w-1/2">
          <img 
            src="/images/nosso-time.jpg" 
            alt="Retrato artístico em preto e branco" 
            className="w-full h-full lg:h-full object-cover object-center filter grayscale"
            style={{ aspectRatio: '16/9', maxHeight: '100%' }}
          />
        </div>
        {/* Texto: 100% em mobile/tablet, 50% em desktop */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 py-10 md:py-16 bg-[var(--color-bg-2)]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-amplitude font-bold text-foreground leading-tight uppercase max-w-[800px]">
            <span className="block">SOMOS UMA PRODUTORA AUDIOVISUAL
            APAIXONADA PELO PODER
            DAS IMAGENS EM MOVIMENTO.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl font-amplitude text-foreground/80 max-w-[800px]">
            Ao longo dos anos, conquistamos a confiança de clientes de diversos setores, trabalhando em projetos que vão desde comerciais e vídeos corporativos até produções cinematográficas e conteúdo para redes sociais.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BottomHeroSection;
