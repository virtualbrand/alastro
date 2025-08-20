import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div 
      className="relative min-h-screen overflow-hidden z-10"
      style={{
        backgroundImage: `url('/lovable-uploads/3c25f351-39dd-452e-a053-63792ffd2aca.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Hero Content */}
      <div className="relative z-20 flex items-center min-h-screen px-6">
        <div className="max-w-4xl">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-amplitude font-bold text-white leading-tight uppercase">
              REGISTRANDO
              <br />
              HISTÓRIAS QUE
              <br />
              <span className="text-primary">CONECTAM</span>
              <br />
              E <span className="text-primary">IMPACTAM</span>
            </h1>
            
            <Button 
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8 py-3 text-lg rounded-none"
            >
              SABER MAIS
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-white z-20">
        <div className="flex flex-col md:flex-row items-center min-h-[400px]">
          {/* Left side - Image */}
          <div className="flex-1 h-full">
            <div className="w-full h-[400px] overflow-hidden">
              <img 
                src="/lovable-uploads/0456ca9b-29a0-4fbe-9dfb-eb99c3e37944.png" 
                alt="Retrato artístico em preto e branco" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          
          {/* Right side - Text */}
          <div className="flex-1 p-8 md:p-16">
            <h2 className="text-2xl md:text-4xl font-amplitude font-bold text-foreground leading-tight uppercase">
              SOMOS UMA PRODUTORA
              <br />
              AUDIOVISUAL APAIXONADA
              <br />
              PELO PODER DAS IMAGENS
              <br />
              EM MOVIMENTO.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;