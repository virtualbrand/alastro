import type { Metadata } from "next";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";
import ServiceHero from "@/components/ServiceHero";
import AutoplayVideo from "@/components/AutoplayVideo";
import { SplitSection } from "@/components/SplitSection";
import { CtaBand } from "@/components/CtaBand";
import { SERVICE_MEDIA, type ServiceMediaKey } from "@/content/service-media";
import { ABOUT_HEADLINE, ABOUT_SECTIONS, ABOUT_TITLE } from "@/content/about";
import { ORGANIZATION_JSON_LD, SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Nossa História: Sobre a Produtora Audiovisual Alastro";
const DESCRIPTION =
  "Conheça a história da Alastro: uma produtora audiovisual que nasceu em Garopaba, em Santa Catarina, e há seis anos conta grandes histórias em projetos pelo Brasil.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/sobre",
    type: "website",
  },
};

const NAV_ITEMS = [
  { name: "SOBRE NÓS", link: "/sobre" },
  { name: "CASES", link: "/#cases" },
  { name: "SERVIÇOS", link: "/#servicos" },
  { name: "CONTATO", link: "/#contato" },
];

/**
 * Mídia de cada faixa, na ordem de ABOUT_SECTIONS: clips curtos em loop (os mesmos dos cases) e,
 * na última faixa ("Nossa equipe"), a foto da equipe.
 */
const SECTION_MEDIA: (ServiceMediaKey | "equipe")[] = [
  "viniday-bts",
  "guudrun-bts",
  "ironman-bts",
  "doc-manu",
  "xama",
  "equipe",
];

export default function SobrePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${SITE_URL}/sobre`,
        url: `${SITE_URL}/sobre`,
        name: TITLE,
        description: DESCRIPTION,
        about: { "@id": ORGANIZATION_JSON_LD["@id"] },
      },
      ORGANIZATION_JSON_LD,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: ABOUT_TITLE, item: `${SITE_URL}/sobre` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-2)]">
      <FloatingNav navItems={NAV_ITEMS} wide />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServiceHero
        breadcrumb={[{ label: SITE_NAME, href: "/" }, { label: ABOUT_TITLE }]}
        name={ABOUT_TITLE}
        headline={ABOUT_HEADLINE}
        fadeIn
      />

      {ABOUT_SECTIONS.map((section, index) => {
        const media = SECTION_MEDIA[index];

        return (
          <SplitSection
            key={section.heading}
            heading={section.heading}
            paragraphs={section.paragraphs}
            reversed={index % 2 === 1}
            fadeIn
            media={
              media === "equipe" ? (
                <img
                  src="/images/equipe-alastro.webp"
                  alt="Equipe da Alastro"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <AutoplayVideo
                  clip={SERVICE_MEDIA[media]}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              )
            }
          />
        );
      })}

      <CtaBand fadeIn />

      <Footer />
    </div>
  );
}
