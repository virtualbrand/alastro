import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  // Generate pixelated background pattern
  const generatePixelPattern = () => {
    const pixels = [];
    for (let i = 0; i < 200; i++) {
      pixels.push(
        <div
          key={i}
          className="absolute bg-gradient-to-br from-green-400 to-green-600 opacity-60"
          style={{
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      );
    }
    return pixels;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 overflow-hidden z-10">
      {/* Pixelated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        {generatePixelPattern()}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-amplitude font-bold text-white leading-tight text-center">
              REGISTRANDO
              <br />
              HISTÓRIAS QUE
              <br />
              <span className="text-green-400">CONECTAM</span>
              <br />
              E <span className="text-green-400">IMPACTAM</span>
            </h1>
            
            <Button 
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 text-lg rounded-none"
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
            <h2 className="text-2xl md:text-4xl font-amplitude font-bold text-gray-900 leading-tight">
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