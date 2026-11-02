import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";
import { sanitizeHtml } from "@/lib/sanitize";
import { fetchPostBySlug, fetchPublishedPosts } from "@/lib/blog-queries";

export const revalidate = 60;

const NAV_ITEMS = [
  { name: "SOBRE NÓS", link: "/#sobre" },
  { name: "CASES", link: "/#cases" },
  { name: "SERVIÇOS", link: "/#servicos" },
  { name: "CONTATO", link: "/#contato" },
];

/** Defensivo: se as tabelas ainda não existirem, o build não quebra. */
export const generateStaticParams = async () => {
  try {
    const posts = await fetchPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
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
  const post = await fetchPostBySlug(slug);

  if (!post) return { title: "Artigo não encontrado | Alastro" };

  const description = post.excerpt ?? "Artigo do blog da Alastro.";

  return {
    title: `${post.title} | Blog Alastro`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: [post.author_name ?? "Alastro"],
      tags: post.tags.map((tag) => tag.name),
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
};

const formatDate = (value: string | null): string | null =>
  value
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(value))
    : null;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) notFound();

  const published = formatDate(post.published_at);
  const author = post.author_name ?? "Alastro";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Organization", name: "Alastro" },
    keywords: post.tags.map((tag) => tag.name).join(", ") || undefined,
    articleSection: post.category?.name,
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <FloatingNav navItems={NAV_ITEMS} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto w-full max-w-[1400px] px-2 pb-24 pt-32 font-amplitude md:px-8">
        <Link
          href="/blog"
          className="group/back mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-primary)] opacity-70 transition-all hover:text-[var(--color-accent-green)] hover:opacity-100"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-1" />
          Todos os artigos
        </Link>

        <article className="mx-auto max-w-3xl">
          <header className="space-y-4">
            {post.category && (
              <Link
                href={`/blog/categoria/${post.category.slug}`}
                className="inline-block text-xs font-bold uppercase tracking-wide text-[var(--color-accent-green)] underline-offset-4 hover:underline"
              >
                {post.category.name}
              </Link>
            )}

            <h1 className="text-4xl font-bold text-[var(--color-heading)] lg:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-paragraph text-[var(--color-text-primary)] opacity-80">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2 text-sm text-[var(--color-text-primary)] opacity-60">
              <span>{author}</span>
              {published && (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={post.published_at ?? undefined}>
                    {published}
                  </time>
                </>
              )}
            </div>
          </header>

          {post.cover_url && (
            <img
              src={post.cover_url}
              alt=""
              className="mt-10 w-full rounded-md object-cover"
            />
          )}

          {post.content && (
            <div
              className="prose prose-invert mt-10 max-w-none prose-headings:text-[var(--color-heading)] prose-p:text-[var(--color-text-primary)] prose-li:text-[var(--color-text-primary)] prose-strong:text-[var(--color-heading)] prose-blockquote:border-l-[var(--color-accent-green)] prose-a:text-[var(--color-accent-green)]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          )}

          {post.tags.length > 0 && (
            <footer className="mt-12 border-t border-[var(--color-border-form)] pt-6">
              <h2 className="sr-only">Tags deste artigo</h2>
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag.id}>
                    <Link
                      href={`/blog/tag/${tag.slug}`}
                      className="inline-block rounded-full border border-[var(--color-border-form)] px-3 py-1 text-xs text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-green)] hover:text-[var(--color-accent-green)]"
                    >
                      #{tag.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
