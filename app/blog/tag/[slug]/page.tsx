import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostGrid } from "@/components/blog/PostGrid";
import { fetchPostsByTag, fetchTagBySlug, fetchTags } from "@/lib/blog-queries";

export const revalidate = 60;

export const generateStaticParams = async () => {
  try {
    const tags = await fetchTags();
    return tags.map((tag) => ({ slug: tag.slug }));
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
  const tag = await fetchTagBySlug(slug);

  if (!tag) return { title: "Tag não encontrada | Alastro" };

  const description = `Artigos marcados com ${tag.name} no blog da Alastro.`;

  return {
    title: `${tag.name} | Blog Alastro`,
    description,
    alternates: { canonical: `/blog/tag/${tag.slug}` },
    openGraph: {
      title: `${tag.name} | Blog Alastro`,
      description,
      url: `/blog/tag/${tag.slug}`,
      type: "website",
    },
  };
};

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await fetchTagBySlug(slug);

  if (!tag) notFound();

  const posts = await fetchPostsByTag(tag.id);

  return <PostGrid eyebrow="Tag" title={`#${tag.name}`} posts={posts} />;
}
