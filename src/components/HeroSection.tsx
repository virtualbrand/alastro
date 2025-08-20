import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-yellow-100 overflow-hidden z-10">
      {/* Hero Content */}
      <div className="relative z-20 flex items-center min-h-screen px-6">
        <div className="max-w-4xl">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-tight text-left">
              REGISTRANDO
              <br />
              HISTÓRIAS QUE
              <br />
              <span className="text-green-600">CONECTAM</span>
              <br />
              E <span className="text-green-600">IMPACTAM</span>
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
          {/* Left side - Text */}
          <div className="flex-1 p-8 md:p-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
              SOMOS UMA PRODUTORA
              <br />
              AUDIOVISUAL APAIXONADA
              <br />
              PELO PODER DAS IMAGENS
              <br />
              EM MOVIMENTO.
            </h2>
          </div>
          
          {/* Right side - Sand placeholder */}
          <div className="flex-1 h-full">
            <div className="w-full h-[400px] bg-yellow-100 flex items-center justify-center">
              <div className="text-yellow-800 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-200/50 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-sm opacity-80">Video Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;