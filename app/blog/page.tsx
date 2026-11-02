import type { Metadata } from "next";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";
import { BlogSearch } from "@/components/blog/BlogSearch";
import {
  fetchCategories,
  fetchPublishedPosts,
  fetchTags,
} from "@/lib/blog-queries";

export const metadata: Metadata = {
  title: "Blog | Alastro - Produtora Audiovisual",
  description:
    "Histórias, bastidores e reflexões sobre produção audiovisual pela equipe da Alastro.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Alastro",
    description: "Histórias e bastidores da produção audiovisual.",
    url: "/blog",
    type: "website",
  },
};

export const revalidate = 60;

const NAV_ITEMS = [
  { name: "SOBRE NÓS", link: "/#sobre" },
  { name: "CASES", link: "/#cases" },
  { name: "SERVIÇOS", link: "/#servicos" },
  { name: "CONTATO", link: "/#contato" },
];

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([
    fetchPublishedPosts(),
    fetchCategories(),
    fetchTags(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <FloatingNav navItems={NAV_ITEMS} />

      <main className="mx-auto w-full max-w-[1400px] px-2 pb-24 pt-32 font-amplitude md:px-8">
        <header className="mb-12 max-w-2xl space-y-4">
          <h1 className="text-4xl font-bold text-[var(--color-heading)] lg:text-5xl">
            Blog
          </h1>
          <p className="text-paragraph text-[var(--color-text-primary)]">
            Histórias, bastidores e o que aprendemos produzindo audiovisual.
          </p>
        </header>

        {/*
          A lista inicial vem do servidor, então a página é indexável e
          renderiza sem JavaScript. A busca e o filtro acontecem no cliente
          por cima dela.
        */}
        <BlogSearch initialPosts={posts} categories={categories} tags={tags} />
      </main>

      <Footer />
    </div>
  );
}
