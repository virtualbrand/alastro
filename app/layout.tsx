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
        
        {/* Google Fonts - Cormorant & Playfair Display */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@400;600;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />
        
        {/* Carregamento otimizado da fonte Adobe - Kit atualizado */}
        <link rel="preload" href="https://use.typekit.net/sip8wfz.css" as="style" />
        <link rel="stylesheet" href="https://use.typekit.net/sip8wfz.css" />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N5V7D6KD');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N5V7D6KD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

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
