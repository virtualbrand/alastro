import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";
import { CaseHeroMedia } from "@/components/CaseHeroMedia";
import { CtaBand } from "@/components/CtaBand";
import { buildCaseCta } from "@/lib/case-cta";
import ServiceHero from "@/components/ServiceHero";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { sanitizeHtml } from "@/lib/sanitize";
import { toEmbedUrl } from "@/lib/video";
import type { CaseRecord } from "@/types/case";

export const revalidate = 60;

const NAV_ITEMS = [
  { name: "SOBRE NÓS", link: "/#sobre" },
  { name: "CASES", link: "/#cases" },
  { name: "SERVIÇOS", link: "/#servicos" },
  { name: "CONTATO", link: "/#contato" },
];

/**
 * Pré-gera as páginas dos cases publicados. Defensivo de propósito: se a
 * tabela ainda não existir, o build segue em vez de quebrar.
 */
export const generateStaticParams = async () => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("cases")
      .select("slug")
      .eq("published", true);
    return (data ?? []).map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
};

const fetchCase = async (slug: string): Promise<CaseRecord | null> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("cases")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as CaseRecord) ?? null;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const item = await fetchCase(slug);

  if (!item) return { title: "Case não encontrado | Alastro" };

  const description =
    item.summary ?? `Projeto audiovisual produzido pela Alastro.`;

  return {
    title: `${item.title} | Cases Alastro`,
    description,
    alternates: { canonical: `/cases/${item.slug}` },
    openGraph: {
      title: item.title,
      description,
      url: `/cases/${item.slug}`,
      type: "article",
      images: item.cover_url ? [{ url: item.cover_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: item.cover_url ? [item.cover_url] : undefined,
    },
  };
};

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await fetchCase(slug);

  if (!item) notFound();

  const embedUrl = toEmbedUrl(item.video_url);
  const cta = buildCaseCta({ client: item.client, services: item.services });

  // Dados estruturados: ajudam o Google a entender a página como obra.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.summary ?? undefined,
    image: item.cover_url ?? undefined,
    datePublished: item.published_at ?? undefined,
    author: { "@type": "Organization", name: "Alastro" },
  };

  // Espelha o breadcrumb visível da página.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cases",
        item: `${SITE_URL}/cases`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title,
        item: `${SITE_URL}/cases/${item.slug}`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ServiceHero
        breadcrumb={[
          { label: SITE_NAME, href: "/" },
          { label: "Cases", href: "/cases" },
          { label: item.title },
        ]}
        eyebrow={item.client ?? undefined}
        name={item.title}
        headline={item.summary ?? ""}
        media={
          <CaseHeroMedia
            title={item.title}
            coverUrl={item.cover_url}
            hoverVideoWebmUrl={item.hover_video_webm_url}
            hoverVideoMp4Url={item.hover_video_mp4_url}
            embedUrl={embedUrl}
          />
        }
      >
        {item.services.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-4">
            {item.services.map((service) => (
              <li
                key={service}
                className="rounded-full border border-foreground/30 px-3 py-1 font-amplitude text-xs text-foreground"
              >
                {service}
              </li>
            ))}
          </ul>
        )}
      </ServiceHero>

      <article className="w-full px-6 pb-24 pt-16 font-amplitude md:px-12 lg:px-20 xl:px-24">
        {item.content && (
          <div
            className="prose max-w-3xl prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }}
          />
        )}

        {item.gallery.length > 0 && (
          <ul className="mt-16 grid gap-4 sm:grid-cols-2">
            {item.gallery.map((url) => (
              <li key={url}>
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  className="w-full rounded-md bg-[var(--color-bg-3)]/20 object-cover"
                />
              </li>
            ))}
          </ul>
        )}
      </article>

      <CtaBand title={cta.heading} description={cta.text} />

      <Footer />
    </div>
  );
}
