"use client";

import { FloatingNav } from "@/components/ui/floating-nav";
import HeroSection from "@/components/HeroSection";
import BottomHeroSection from "@/components/BottomHeroSection";
import { Footer } from "@/components/Footer";
import { useEffect, lazy, Suspense } from "react";
import type { HomeCase } from "@/lib/cases-queries";
import type { SiteClient } from "@/lib/clients-queries";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

// Lazy load de componentes abaixo da dobra (below the fold)
const ManifestoSection = lazy(() => import("@/components/ManifestoSection"));
const VideoHeroSection = lazy(() => import("@/components/VideoHeroSection"));
const BastidoresSection = lazy(() => import("@/components/BastidoresSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const ClientsSection = lazy(() => import("@/components/ClientsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

/**
 * Os dados do banco (clientes, marcas e cases em destaque) chegam prontos do
 * servidor por props: a home é client component (usa useEffect e lazy).
 */
export default function HomeShell({
  clients,
  brands,
  featuredCases,
  featuredBastidores,
}: {
  /** Clientes do painel, para a fileira vinda do banco na seção de clientes. */
  clients?: SiteClient[];
  /** Marcas do painel, para a fileira de marcas vinda do banco. */
  brands?: SiteClient[];
  /** Cases em destaque do painel, para as fileiras vindas do banco em "Nossos trabalhos". */
  featuredCases?: HomeCase[];
  /** Bastidores em destaque do painel, para as fileiras vindas do banco em "Por trás das câmeras". */
  featuredBastidores?: HomeCase[];
}) {
  const navItems = [
    { name: "SOBRE NÓS", link: "#sobre" },
    { name: "CASES", link: "#cases" },
    { name: "SERVIÇOS", link: "#servicos" },
    { name: "CONTATO", link: "#contato" },
  ];

  const { scrollToElement } = useSmoothScroll();

  // Scroll para a seção quando há hash na URL. As seções abaixo da dobra são
  // carregadas sob demanda, então tenta de novo até o elemento existir.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      const element = document.querySelector(hash);
      attempts += 1;
      if (element) {
        window.clearInterval(timer);
        scrollToElement(hash.slice(1));
      } else if (attempts >= 30) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [scrollToElement]);

  return (
    <div className="min-h-screen bg-background">
      <FloatingNav navItems={navItems} wide />
      <HeroSection />
      <BottomHeroSection />
      <Suspense fallback={<div className="min-h-screen" />}>
        <ManifestoSection />
        <VideoHeroSection dbCases={featuredCases} />
        <BastidoresSection dbCases={featuredBastidores} />
        <ServicesSection />
        <ClientsSection dbClients={clients} dbBrands={brands} />
        <TestimonialsSection />
        <ContactSection />
      </Suspense>
      <Footer />
    </div>
  );
}
