import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostGrid } from "@/components/blog/PostGrid";
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchPostsByCategory,
} from "@/lib/blog-queries";

export const revalidate = 60;

export const generateStaticParams = async () => {
  try {
    const categories = await fetchCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  if (!category) return { title: "Categoria não encontrada | Alastro" };

  const description =
    category.description ?? `Artigos sobre ${category.name} no blog da Alastro.`;

  return {
    title: `${category.name} | Blog Alastro`,
    description,
    alternates: { canonical: `/blog/categoria/${category.slug}` },
    openGraph: {
      title: `${category.name} | Blog Alastro`,
      description,
      url: `/blog/categoria/${category.slug}`,
      type: "website",
    },
  };
};

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  if (!category) notFound();

  const posts = await fetchPostsByCategory(category.id);

  return (
    <PostGrid
      eyebrow="Categoria"
      title={category.name}
      description={category.description}
      posts={posts}
    />
  );
}
