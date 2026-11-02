"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Search, X } from "lucide-react";
import { searchPosts } from "@/services/blogService";
import { PostCard } from "@/components/blog/PostCard";
import type { BlogCategory, BlogPostWithRelations, BlogTag } from "@/types/blog";
import { cn } from "@/lib/utils";

interface BlogSearchProps {
  /** Artigos renderizados no servidor; é o que aparece sem busca ativa. */
  initialPosts: BlogPostWithRelations[];
  categories: BlogCategory[];
  tags: BlogTag[];
}

export const BlogSearch = ({
  initialPosts,
  categories,
  tags,
}: BlogSearchProps) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<BlogPostWithRelations[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // Descarta respostas de buscas antigas que chegarem fora de ordem.
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = term.trim();

    if (trimmed.length === 0) {
      setResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const current = ++requestId.current;

    const timer = setTimeout(async () => {
      try {
        const found = await searchPosts(trimmed);
        if (current !== requestId.current) return;
        setResults(found);
        setError(null);
      } catch {
        if (current !== requestId.current) return;
        setError("A busca falhou. Tente novamente.");
      } finally {
        if (current === requestId.current) setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [term]);

  // A base muda conforme há busca; o filtro de categoria se aplica sobre ela.
  const visible = useMemo(() => {
    const base = results ?? initialPosts;
    return categoryId
      ? base.filter((post) => post.category_id === categoryId)
      : base;
  }, [results, initialPosts, categoryId]);

  const isFiltering = term.trim().length > 0 || categoryId !== null;

  return (
    <div className="space-y-8">
      {/* Busca */}
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-primary)] opacity-50" />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar artigos..."
          aria-label="Buscar artigos"
          className="h-12 w-full rounded-md border-2 border-[var(--color-border-form)] bg-[var(--color-surface)] pl-11 pr-11 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-border-form)] focus:border-[var(--color-accent-green)]"
        />
        {term && (
          <button
            type="button"
            onClick={() => setTerm("")}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-text-primary)] opacity-60 transition-opacity hover:opacity-100"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Categorias */}
      {categories.length > 0 && (
        <nav aria-label="Filtrar por categoria">
          <ul className="flex flex-wrap gap-2">
            <li>
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                aria-pressed={categoryId === null}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-bold uppercase transition-colors",
                  categoryId === null
                    ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green)] text-[var(--color-text-secondary)]"
                    : "border-[var(--color-border-form)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-green)]"
                )}
              >
                Todos
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  aria-pressed={categoryId === category.id}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-bold uppercase transition-colors",
                    categoryId === category.id
                      ? "border-[var(--color-accent-green)] bg-[var(--color-accent-green)] text-[var(--color-text-secondary)]"
                      : "border-[var(--color-border-form)] text-[var(--color-text-primary)] hover:border-[var(--color-accent-green)]"
                  )}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Tags levam a páginas próprias — são rota, não filtro local */}
      {tags.length > 0 && !isFiltering && (
        <nav aria-label="Navegar por tag">
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-block rounded-full border border-[var(--color-border-form)] px-3 py-1 text-xs text-[var(--color-text-primary)] opacity-70 transition-all hover:border-[var(--color-accent-green)] hover:text-[var(--color-accent-green)] hover:opacity-100"
                >
                  #{tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Resultados */}
      {visible.length === 0 ? (
        <p className="py-12 text-[var(--color-text-primary)] opacity-70">
          {isFiltering
            ? "Nenhum artigo encontrado com esses critérios."
            : "Nenhum artigo publicado ainda."}
        </p>
      ) : (
        <>
          {isFiltering && (
            <p
              aria-live="polite"
              className="text-xs uppercase tracking-wide text-[var(--color-text-primary)] opacity-60"
            >
              {visible.length}{" "}
              {visible.length === 1 ? "artigo encontrado" : "artigos encontrados"}
            </p>
          )}
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
