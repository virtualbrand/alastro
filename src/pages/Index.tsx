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

const Index = () => {
  const navItems = [
    { name: "SOBRE NÓS", link: "#sobre" },
    { name: "PORTFÓLIO", link: "#portfolio" },
    { name: "TRABALHE CONOSCO", link: "#trabalhe" },
    { name: "CONTATO", link: "#contato" },
  ];

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
