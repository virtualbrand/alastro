import React from "react";

const BottomHeroSection = () => {
  return (
    <div className="relative bg-[var(--color-bg-2)] w-full">
      <div className="flex flex-col md:flex-row items-center">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2">
          <div className="h-[400px] w-screen md:w-full overflow-hidden">
            <img 
              src="/lovable-uploads/0456ca9b-29a0-4fbe-9dfb-eb99c3e37944.png" 
              alt="Retrato artístico em preto e branco" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        {/* Right side - Text */}
        <div className="w-full md:w-1/2 px-8 py-16 md:p-16 bg-[var(--color-bg-2)]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-amplitude font-bold text-foreground leading-tight uppercase max-w-[800px]">
            <span className="block">SOMOS UMA PRODUTORA AUDIOVISUAL</span>
            <span className="block">APAIXONADA PELO PODER</span>
            <span className="block">DAS IMAGENS EM MOVIMENTO.</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BottomHeroSection;
