import { createPublicClient } from "@/lib/supabase/public";
import {
  POST_WITH_RELATIONS_SELECT,
  withRelations,
  type BlogCategory,
  type BlogPostWithRelations,
  type BlogTag,
} from "@/types/blog";

/**
 * Consultas de leitura pública usadas pelas páginas do blog.
 *
 * Usam o cliente sem cookies para as rotas continuarem estáticas com
 * revalidação — ver o comentário em lib/supabase/public.ts.
 */

export const fetchPublishedPosts = async (
  limit = 60
): Promise<BlogPostWithRelations[]> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(POST_WITH_RELATIONS_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data ?? []).map(withRelations);
};

export const fetchPostBySlug = async (
  slug: string
): Promise<BlogPostWithRelations | null> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(POST_WITH_RELATIONS_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data ? withRelations(data) : null;
};

export const fetchCategories = async (): Promise<BlogCategory[]> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name");
  return (data ?? []) as BlogCategory[];
};

export const fetchTags = async (): Promise<BlogTag[]> => {
  const supabase = createPublicClient();
  const { data } = await supabase.from("blog_tags").select("*").order("name");
  return (data ?? []) as BlogTag[];
};

export const fetchCategoryBySlug = async (
  slug: string
): Promise<BlogCategory | null> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as BlogCategory) ?? null;
};

export const fetchTagBySlug = async (slug: string): Promise<BlogTag | null> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as BlogTag) ?? null;
};

export const fetchPostsByCategory = async (
  categoryId: string
): Promise<BlogPostWithRelations[]> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(POST_WITH_RELATIONS_SELECT)
    .eq("published", true)
    .eq("category_id", categoryId)
    .order("published_at", { ascending: false, nullsFirst: false });
  return (data ?? []).map(withRelations);
};

export const fetchPostsByTag = async (
  tagId: string
): Promise<BlogPostWithRelations[]> => {
  const supabase = createPublicClient();
  // Filtra pela tabela de vínculo e já traz as relações do post.
  const { data } = await supabase
    .from("blog_post_tags")
    .select(`post:blog_posts(${POST_WITH_RELATIONS_SELECT})`)
    .eq("tag_id", tagId);

  // O supabase-js tipa o vínculo aninhado como array; na prática é um
  // objeto só, já que post_id é chave estrangeira única na linha.
  return ((data ?? []) as unknown as { post: Record<string, unknown> | null }[])
    .map((row) => row.post)
    .filter((post): post is Record<string, unknown> => Boolean(post))
    .map(withRelations)
    .filter((post) => post.published)
    .sort((a, b) =>
      (b.published_at ?? "").localeCompare(a.published_at ?? "")
    );
};
