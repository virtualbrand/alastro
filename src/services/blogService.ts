"use client";

import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import {
  POST_WITH_RELATIONS_SELECT,
  withRelations,
  type BlogCategory,
  type BlogPost,
  type BlogPostInput,
  type BlogPostWithRelations,
  type BlogTag,
} from "@/types/blog";
import { describeDbError, type PostgrestLikeError } from "@/lib/db-errors";

export class BlogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlogError";
  }
}

/**
 * Traduz o erro para uma frase clara ao usuário (ver describeDbError). O
 * detalhe técnico vai para o console, que é de onde se diagnostica.
 */
const describe = (error: PostgrestLikeError): string => {
  // Detalhe técnico só no console; o usuário recebe uma frase clara.
  console.error("[blog]", error.code, error.message, error.details, error.hint);
  return describeDbError(error, {
    duplicate: "Já existe um artigo com essa URL. Altere o campo de URL.",
  });
};

// ---------------------------------------------------------------------------
// Categorias e tags
// ---------------------------------------------------------------------------

export const listCategories = async (): Promise<BlogCategory[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name");
  if (error) throw new BlogError(describe(error));
  return (data ?? []) as BlogCategory[];
};

export const listTags = async (): Promise<BlogTag[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_tags")
    .select("*")
    .order("name");
  if (error) throw new BlogError(describe(error));
  return (data ?? []) as BlogTag[];
};

export const createCategory = async (name: string): Promise<BlogCategory> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .insert({ name: name.trim(), slug: slugify(name) })
    .select()
    .single();
  if (error) throw new BlogError(describe(error));
  return data as BlogCategory;
};

/**
 * Devolve a tag existente ou cria. O slug é a chave de deduplicação, então
 * "Audiovisual" e "audiovisual" convergem para o mesmo registro.
 */
export const findOrCreateTag = async (name: string): Promise<BlogTag> => {
  const supabase = createClient();
  const slug = slugify(name);

  const { data: existing } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) return existing as BlogTag;

  const { data, error } = await supabase
    .from("blog_tags")
    .insert({ name: name.trim(), slug })
    .select()
    .single();
  if (error) throw new BlogError(describe(error));
  return data as BlogTag;
};

// ---------------------------------------------------------------------------
// Artigos
// ---------------------------------------------------------------------------

export const listPosts = async (): Promise<BlogPostWithRelations[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_WITH_RELATIONS_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw new BlogError(describe(error));
  return (data ?? []).map(withRelations);
};

/** Substitui o conjunto de tags do artigo pelo informado. */
const syncTags = async (postId: string, tagIds: string[]): Promise<void> => {
  const supabase = createClient();

  const { error: clearError } = await supabase
    .from("blog_post_tags")
    .delete()
    .eq("post_id", postId);
  if (clearError) throw new BlogError(describe(clearError));

  if (tagIds.length === 0) return;

  const { error } = await supabase
    .from("blog_post_tags")
    .insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
  if (error) throw new BlogError(describe(error));
};

export const createPost = async (
  input: BlogPostInput,
  tagIds: string[],
): Promise<BlogPost> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...input, created_by: user?.id ?? null })
    .select()
    .single();
  if (error) throw new BlogError(describe(error));

  await syncTags((data as BlogPost).id, tagIds);
  return data as BlogPost;
};

export const updatePost = async (
  id: string,
  input: BlogPostInput,
  tagIds: string[],
): Promise<BlogPost> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new BlogError(describe(error));

  await syncTags(id, tagIds);
  return data as BlogPost;
};

export const deletePost = async (id: string): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new BlogError(describe(error));
};

export const setPostPublished = async (
  id: string,
  published: boolean,
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({ published })
    .eq("id", id);
  if (error) throw new BlogError(describe(error));
};

// ---------------------------------------------------------------------------
// Busca pública
// ---------------------------------------------------------------------------

/**
 * Busca full-text nos artigos publicados.
 *
 * `websearch` aceita a sintaxe que as pessoas já conhecem de buscador:
 * aspas para expressão exata, OR, e `-` para excluir.
 */
export const searchPosts = async (
  term: string,
  limit = 12,
): Promise<BlogPostWithRelations[]> => {
  const supabase = createClient();
  const query = supabase
    .from("blog_posts")
    .select(POST_WITH_RELATIONS_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  const trimmed = term.trim();
  const { data, error } = trimmed
    ? await query.textSearch("search_vector", trimmed, {
        type: "websearch",
        config: "portuguese",
      })
    : await query;

  if (error) throw new BlogError(describe(error));
  return (data ?? []).map(withRelations);
};
