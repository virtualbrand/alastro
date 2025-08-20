import { FloatingNav } from "@/components/ui/floating-nav";
import HeroSection from "@/components/HeroSection";
import VideoHeroSection from "@/components/VideoHeroSection";
import WorksGallerySection from "@/components/WorksGallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";

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
      <VideoHeroSection />
      <WorksGallerySection />
      <TestimonialsSection />
    </div>
  );
};

export default Index;
