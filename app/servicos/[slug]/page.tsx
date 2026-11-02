import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";
import ServiceHero from "@/components/ServiceHero";
import ServicesCarousel from "@/components/ServicesCarousel";
import AutoplayVideo from "@/components/AutoplayVideo";
import { SplitSection } from "@/components/SplitSection";
import { CtaBand } from "@/components/CtaBand";
import { SERVICE_MEDIA } from "@/content/service-media";
import {
  SERVICES,
  getOtherServices,
  getRelatedServices,
  getService,
} from "@/content/services";
import { ORGANIZATION_JSON_LD, SITE_NAME, SITE_URL } from "@/lib/site";

const NAV_ITEMS = [
  { name: "SOBRE NÓS", link: "/#sobre" },
  { name: "CASES", link: "/#cases" },
  { name: "SERVIÇOS", link: "/#servicos" },
  { name: "CONTATO", link: "/#contato" },
];

// Conteúdo fixo no código: só os slugs listados existem.
export const dynamicParams = false;

export const generateStaticParams = () =>
  SERVICES.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return { title: "Serviço não encontrado | Alastro" };

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    keywords: service.keywords,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: `/servicos/${service.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.seoTitle,
      description: service.seoDescription,
    },
  };
};

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const related = getRelatedServices(service);
  const others = getOtherServices(service);
  // Introdução (sem título) + seções do serviço, cada uma em uma faixa 50/50.
  const blocks: { heading?: string; paragraphs: string[] }[] = [
    { paragraphs: service.intro },
    ...service.sections.map((section) => ({ heading: section.title, paragraphs: section.paragraphs })),
  ];
  const url = `${SITE_URL}/servicos/${service.slug}`;

  // Service + breadcrumb: dão a buscadores e a motores generativos a
  // relação explícita entre o serviço, a Alastro e o arquivo /servicos.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.name,
        description: service.seoDescription,
        url,
        serviceType: service.name,
        areaServed: { "@type": "Country", name: "Brasil" },
        provider: { "@id": ORGANIZATION_JSON_LD["@id"] },
        isRelatedTo: related.map((item) => ({
          "@type": "Service",
          name: item.name,
          url: `${SITE_URL}/servicos/${item.slug}`,
        })),
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
          { "@type": "ListItem", position: 3, name: service.name, item: url },
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
        breadcrumb={[
          { label: SITE_NAME, href: "/" },
          { label: "Serviços", href: "/servicos" },
          { label: service.name },
        ]}
        name={service.name}
        headline={service.headline}
      />

      {/* Conteúdo em seções 50/50 que alternam o lado do texto; o vídeo é um mockup em loop. */}
      {blocks.map((block, index) => (
        <SplitSection
          key={block.heading ?? "introducao"}
          heading={block.heading}
          label={`Sobre ${service.name}`}
          paragraphs={block.paragraphs}
          reversed={index % 2 === 1}
          media={
            <AutoplayVideo
              clip={SERVICE_MEDIA[service.media[index % service.media.length]]}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          }
        />
      ))}

      {/* Sombra no topo (padrão das divisas de seção): separa o conteúdo das outras áreas. */}
      <div className="relative z-[1] w-full bg-[var(--color-bg-2)] px-6 pb-24 pt-20 font-amplitude shadow-section-top md:px-12 lg:px-20 xl:px-24">
        <section aria-labelledby="other-services-title">
          <ServicesCarousel
            items={others.map((item) => ({
              slug: item.slug,
              name: item.name,
              summary: item.summary,
              icon: (
                <item.icon
                  aria-hidden="true"
                  className="h-6 w-6"
                  strokeWidth={1.5}
                />
              ),
            }))}
          />
        </section>
      </div>

      <CtaBand />

      <Footer />
    </div>
  );
}
