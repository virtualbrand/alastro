import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";
import ToastProviders from "./toast-providers";
import Script from "next/script";
import "@/globals.css";

export const metadata: Metadata = {
  title: "Alastro - Produtora Audiovisual",
  description: "Transformamos ideias em histórias visuais impactantes",
  keywords: ["produtora audiovisual", "produção de vídeo", "documentário", "conteúdo audiovisual"],
  authors: [{ name: "Alastro" }],
  openGraph: {
    title: "Alastro - Produtora Audiovisual",
    description: "Transformamos ideias em histórias visuais impactantes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect para Adobe Fonts */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://use.typekit.net" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        
        {/* Preload da imagem hero crítica */}
        <link rel="preload" href="/images/hero-bg.avif" as="image" type="image/avif" />
        
        {/* Carregamento otimizado da fonte Adobe - Kit atualizado */}
        <link rel="preload" href="https://use.typekit.net/sip8wfz.css" as="style" />
        <link rel="stylesheet" href="https://use.typekit.net/sip8wfz.css" />
      </head>
      <body>
        <Providers>
          <TooltipProvider>
            <ToastProviders />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
