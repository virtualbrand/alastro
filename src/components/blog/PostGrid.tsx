import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/components/blog/PostCard";
import type { BlogPostWithRelations } from "@/types/blog";

const NAV_ITEMS = [
  { name: "SOBRE NÓS", link: "/#sobre" },
  { name: "CASES", link: "/#cases" },
  { name: "CONTATO", link: "/#contato" },
];

/** Casca compartilhada pelas páginas de categoria e de tag. */
export const PostGrid = ({
  eyebrow,
  title,
  description,
  posts,
}: {
  eyebrow: string;
  title: string;
  description?: string | null;
  posts: BlogPostWithRelations[];
}) => (
  <div className="min-h-screen bg-[var(--color-bg)]">
    <FloatingNav navItems={NAV_ITEMS} />

    <main className="mx-auto w-full max-w-[1400px] px-2 pb-24 pt-32 font-amplitude md:px-8">
      <Link
        href="/blog"
        className="group/back mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-primary)] opacity-70 transition-all hover:text-[var(--color-accent-green)] hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-1" />
        Todos os artigos
      </Link>

      <header className="mb-12 max-w-2xl space-y-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-accent-green)]">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-bold text-[var(--color-heading)] lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-paragraph text-[var(--color-text-primary)] opacity-80">
            {description}
          </p>
        )}
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-primary)] opacity-60">
          {posts.length} {posts.length === 1 ? "artigo" : "artigos"}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--color-text-primary)] opacity-70">
          Nenhum artigo publicado aqui ainda.
        </p>
      ) : (
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>

    <Footer />
  </div>
);
