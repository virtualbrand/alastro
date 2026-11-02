import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";
import ToastProviders from "./toast-providers";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import SiteWhatsApp from "@/components/SiteWhatsApp";
import "@/globals.css";

export const metadata: Metadata = {
  // Resolve canonicals e URLs de Open Graph relativas em endereços absolutos.
  metadataBase: new URL(SITE_URL),
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/*
          Adobe Fonts (Amplitude): a cadeia é CSS → @import de p.typekit.net → arquivos da fonte.
          Cada elo precisa da conexão já aberta e, se possível, já baixado:
          - preconnect com e sem crossorigin: o CSS usa o pool sem credenciais e
            os arquivos de fonte (sempre CORS) usam o pool com crossorigin.
          - preload do CSS e dos woff2 de 400 e 700: baixam em paralelo e com
            prioridade alta, em vez de esperar o CSS ser aplicado.
        */}
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="preload" as="style" href="https://use.typekit.net/sip8wfz.css" />
        {/* URLs copiadas do CSS do projeto (sip8wfz.css). Se a Adobe mudar a versão
            da fonte o preload deixa de ser usado, sem quebrar nada: atualize-as. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="https://use.typekit.net/af/4c0db4/00000000000000007750b3ce/31/l?primer=7fa3915bdafdf03041871920a205bef951d72bf64dd4c4460fb992e3ecc3a862&fvd=n4&v=3"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="https://use.typekit.net/af/73f78f/00000000000000007750b3d1/31/l?primer=7fa3915bdafdf03041871920a205bef951d72bf64dd4c4460fb992e3ecc3a862&fvd=n7&v=3"
        />

        {/*
          Adobe Fonts (Amplitude): carregado via media=print + swap para não bloquear o render.

          Os títulos ficam com visibility:hidden (classe fonts-loading, ver globals.css) até a
          Amplitude estar pronta, com teto de 300 ms. Assim o texto não aparece na fonte
          provisória para depois trocar. É visibility, e não display: o espaço do título
          continua reservado, então nada se mexe. Sem JS a classe nunca é adicionada.
        */}
        <Script id="adobe-fonts-loader" strategy="beforeInteractive">
          {`
            (function () {
              var root = document.documentElement;
              root.classList.add('fonts-loading');
              var done = function () { root.classList.remove('fonts-loading'); };
              setTimeout(done, 300);

              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://use.typekit.net/sip8wfz.css';
              link.media = 'print';
              link.onload = function () {
                this.media = 'all';
                // Só depois do CSS a Amplitude existe para o document.fonts.
                if (document.fonts && document.fonts.load) {
                  document.fonts.load('700 1em amplitude').then(done, done);
                } else {
                  done();
                }
              };
              link.onerror = done;
              document.head.appendChild(link);
            })();
          `}
        </Script>
        <noscript>
          <link rel="stylesheet" href="https://use.typekit.net/sip8wfz.css" />
        </noscript>

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
            <SiteWhatsApp />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
