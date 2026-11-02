import Link from "next/link";
import type { BlogPostWithRelations } from "@/types/blog";

const formatDate = (value: string | null): string | null => {
  if (!value) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

export const PostCard = ({ post }: { post: BlogPostWithRelations }) => {
  const published = formatDate(post.published_at);

  return (
    <article className="group h-full">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="aspect-[16/9] overflow-hidden rounded-md bg-[var(--color-surface)]">
          {post.cover_url && (
            <img
              src={post.cover_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2">
          {post.category && (
            <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-accent-green)]">
              {post.category.name}
            </span>
          )}

          <h3 className="text-xl font-bold text-[var(--color-heading)]">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-[var(--color-text-primary)] opacity-80">
              {post.excerpt}
            </p>
          )}

          {published && (
            <time
              dateTime={post.published_at ?? undefined}
              className="mt-auto pt-2 text-xs text-[var(--color-text-primary)] opacity-60"
            >
              {published}
            </time>
          )}
        </div>
      </Link>
    </article>
  );
};
