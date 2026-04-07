import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casamento | Alastro - Cobertura Audiovisual para Casamentos",
  description:
    "A Alastro transforma o seu grande dia em memórias inesquecíveis. Cobertura audiovisual completa para casamentos: filme documentário, fotos e conteúdo para redes sociais.",
  keywords: [
    "fotografia de casamento",
    "filmagem de casamento",
    "cobertura audiovisual casamento",
    "filme de casamento",
    "documentário de casamento",
    "vídeo de casamento",
    "fotógrafo de casamento",
    "cinegrafista casamento",
    "produtora audiovisual casamento",
    "alastro casamento",
  ],
  authors: [{ name: "Alastro" }],
  metadataBase: new URL("https://somosalastro.com"),
  alternates: {
    canonical: "/wedding",
  },
  openGraph: {
    title: "Casamento | Alastro - Cobertura Audiovisual para Casamentos",
    description:
      "Eternizamos o seu grande dia em imagens. Cobertura audiovisual completa: filme documentário, fotos e conteúdo para redes sociais.",
    url: "https://somosalastro.com/wedding",
    siteName: "Alastro",
    images: [
      {
        url: "/images/wedding/hero-wedding.webp",
        width: 1200,
        height: 630,
        alt: "Alastro - Cobertura Audiovisual para Casamentos",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casamento | Alastro - Cobertura Audiovisual para Casamentos",
    description:
      "Eternizamos o seu grande dia em imagens. Cobertura audiovisual completa: filme documentário, fotos e conteúdo para redes sociais.",
    images: ["/images/wedding/hero-wedding.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
