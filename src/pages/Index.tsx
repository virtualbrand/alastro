import { FloatingNav } from "@/components/ui/floating-nav";
import HeroSection from "@/components/HeroSection";
import VideoHeroSection from "@/components/VideoHeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import ClientsSection from "@/components/ClientsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import BottomHeroSection from "@/components/BottomHeroSection";
import BastidoresSection from "@/components/BastidoresSection";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "SOBRE NÓS", link: "#sobre" },
    { name: "PORTFÓLIO", link: "#portfolio" },
    { name: "CONTATO", link: "#contato" },
  ];

  // Scroll para a seção quando há hash na URL
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav navItems={navItems} />
      <HeroSection />
      <BottomHeroSection />
      <ManifestoSection />
      <VideoHeroSection />
      <BastidoresSection />
      <ClientsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
