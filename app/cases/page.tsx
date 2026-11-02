import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";
import ServiceHero from "@/components/ServiceHero";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { CaseRecord } from "@/types/case";
import { CasesGrid, type CaseCard } from "@/components/CasesGrid";

export const metadata: Metadata = {
  title: "Cases | Alastro - Produtora Audiovisual",
  description:
    "Projetos audiovisuais produzidos pela Alastro: documentários, campanhas e conteúdo de marca.",
  alternates: { canonical: "/cases" },
  openGraph: {
    title: "Cases | Alastro",
    description: "Projetos audiovisuais produzidos pela Alastro.",
    url: "/cases",
    type: "website",
  },
};

// Revalida periodicamente: o conteúdo muda pelo painel, não pelo deploy.
export const revalidate = 60;

const NAV_ITEMS = [
  { name: "SOBRE NÓS", link: "/#sobre" },
  { name: "CASES", link: "/#cases" },
  { name: "SERVIÇOS", link: "/#servicos" },
  { name: "CONTATO", link: "/#contato" },
];

export default async function CasesPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("cases")
    .select("*, case_clients(clients(name))")
    .eq("published", true)
    .order("position", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false });

  type Row = CaseRecord & { case_clients: { clients: { name: string } | null }[] | null };
  const cases = (data ?? []) as Row[];
  // Só o que o card usa: o HTML do conteúdo não precisa ir para o cliente.
  const cards: CaseCard[] = cases.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category ?? "case",
    clients: (item.case_clients ?? []).flatMap((link) => (link.clients ? [link.clients.name] : [])),
    client: item.client,
    summary: item.summary,
    services: item.services ?? [],
    tags: item.tags ?? [],
    cover_url: item.cover_url,
    hover_video_webm_url: item.hover_video_webm_url,
    hover_video_mp4_url: item.hover_video_mp4_url,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <FloatingNav navItems={NAV_ITEMS} wide />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: SITE_NAME,
                item: SITE_URL,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Cases",
                item: `${SITE_URL}/cases`,
              },
            ],
          }),
        }}
      />

      <ServiceHero
        breadcrumb={[{ label: SITE_NAME, href: "/" }, { label: "Cases" }]}
        name="Cases"
        headline="Projetos que produzimos do roteiro à entrega final."
      />

      <main className="w-full bg-[var(--color-bg-2)] pb-24 pt-16 font-amplitude">
        {cases.length === 0 ? (
          <p className="px-6 text-[var(--color-text-secondary)] opacity-70 md:px-12 lg:px-20 xl:px-24">
            Nenhum case publicado ainda.
          </p>
        ) : (
          <CasesGrid cases={cards} />
        )}
      </main>

      <Footer />
    </div>
  );
}
