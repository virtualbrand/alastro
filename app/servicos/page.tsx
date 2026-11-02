import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";
import ServiceHero from "@/components/ServiceHero";
import { SERVICES } from "@/content/services";
import { ORGANIZATION_JSON_LD, SITE_NAME, SITE_URL } from "@/lib/site";

const TITLE = "Serviços de Produtora Audiovisual e Marketing | Alastro";
const DESCRIPTION =
  "Conheça os serviços da Alastro: produção audiovisual, conteúdo estratégico, redes sociais, branding, marketing digital, direção criativa, planejamento, consultoria e tráfego pago.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/servicos" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/servicos",
    type: "website",
  },
};

const NAV_ITEMS = [
  { name: "SOBRE NÓS", link: "/#sobre" },
  { name: "CASES", link: "/#cases" },
  { name: "SERVIÇOS", link: "/#servicos" },
  { name: "CONTATO", link: "/#contato" },
];

export default function ServicosPage() {
  // Página-índice: lista ordenada dos serviços, cada um com URL própria.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/servicos`,
        url: `${SITE_URL}/servicos`,
        name: TITLE,
        description: DESCRIPTION,
        about: { "@id": ORGANIZATION_JSON_LD["@id"] },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: SERVICES.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: service.name,
            url: `${SITE_URL}/servicos/${service.slug}`,
          })),
        },
      },
      ORGANIZATION_JSON_LD,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Serviços",
            item: `${SITE_URL}/servicos`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <FloatingNav navItems={NAV_ITEMS} wide />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServiceHero
        breadcrumb={[{ label: SITE_NAME, href: "/" }, { label: "Serviços" }]}
        name="Serviços"
        headline="A Alastro é uma produtora audiovisual brasileira que une estratégia, criatividade e produção. Conheça as nove frentes em que atuamos, da produção de documentários e filmes para marcas ao marketing, ao branding e ao tráfego pago."
      />

      {SERVICES.map((service, index) => (
        <section
          key={service.slug}
          aria-labelledby={`servico-${service.slug}`}
          className={`flex min-h-[560px] flex-col lg:min-h-[640px] ${
            index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          {/* Foto: no mobile fica no topo; no desktop ocupa a outra metade. Os lados alternam a cada serviço (a primeira seção segue a CTA da home: foto à direita). */}
          <div className="relative h-72 w-full md:h-auto md:w-1/2">
            <img
              src={service.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Texto: o título é o único link; o ::after estica a área clicável pela coluna inteira */}
          <div className="group relative flex w-full items-center bg-[var(--color-bg)] px-6 py-16 font-amplitude md:w-1/2 md:px-12 lg:px-20 xl:px-24">
            <div className="w-full max-w-xl space-y-5">
              <service.icon
                aria-hidden="true"
                className="h-10 w-10 text-[var(--color-accent-green)]"
                strokeWidth={1.5}
              />
              <h2
                id={`servico-${service.slug}`}
                className="text-3xl font-bold text-[var(--color-heading)] lg:text-4xl"
              >
                <Link
                  href={`/servicos/${service.slug}`}
                  className="outline-none after:absolute after:inset-0 after:content-['']"
                >
                  {service.name}
                </Link>
              </h2>
              <p className="text-paragraph text-[var(--color-text-primary)] opacity-80">
                {service.summary}
              </p>
              <span
                aria-hidden="true"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--color-accent-green)] transition-transform duration-300 group-hover:translate-x-1"
              >
                Saiba mais
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}
