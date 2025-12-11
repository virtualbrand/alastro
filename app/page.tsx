"use client";

import { FloatingNav } from "@/components/ui/floating-nav";
import HeroSection from "@/components/HeroSection";
import BottomHeroSection from "@/components/BottomHeroSection";
import { Footer } from "@/components/Footer";
import { useEffect, lazy, Suspense } from "react";

// Lazy load de componentes abaixo da dobra (below the fold)
const ManifestoSection = lazy(() => import("@/components/ManifestoSection"));
const VideoHeroSection = lazy(() => import("@/components/VideoHeroSection"));
const BastidoresSection = lazy(() => import("@/components/BastidoresSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const ClientsSection = lazy(() => import("@/components/ClientsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

export default function Home() {
  const navItems = [
    { name: "SOBRE NÓS", link: "#sobre" },
    { name: "PORTFÓLIO", link: "#portfolio" },
    { name: "CONTATO", link: "#contato" },
  ];

  // Scroll para a seção quando há hash na URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav navItems={navItems} />
      <HeroSection />
      <BottomHeroSection />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ManifestoSection />
        <VideoHeroSection />
        <BastidoresSection />
        <ServicesSection />
        <ClientsSection />
        <TestimonialsSection />
        <ContactSection />
      </Suspense>
      <Footer />
    </div>
  );
}
