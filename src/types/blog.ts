export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

export interface BlogTag {
  id: string;
  slug: string;
  name: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  /** HTML do editor. Sanitizar antes de renderizar. */
  content: string | null;
  cover_url: string | null;
  author_name: string | null;
  category_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Post com os vínculos já resolvidos, como as páginas consomem. */
export interface BlogPostWithRelations extends BlogPost {
  category: BlogCategory | null;
  tags: BlogTag[];
}

/** Campos que o formulário do painel controla. */
export type BlogPostInput = Pick<
  BlogPost,
  | "slug"
  | "title"
  | "excerpt"
  | "content"
  | "cover_url"
  | "author_name"
  | "category_id"
  | "published"
>;

/** A consulta traz os vínculos aninhados; isto normaliza o formato. */
export const withRelations = (row: Record<string, unknown>): BlogPostWithRelations => {
  const { category, blog_post_tags, ...post } = row as Record<string, any>;
  return {
    ...(post as BlogPost),
    category: (category as BlogCategory) ?? null,
    tags: ((blog_post_tags ?? []) as { tag: BlogTag }[])
      .map((link) => link.tag)
      .filter(Boolean),
  };
};

/** Colunas pedidas quando a página precisa de categoria e tags juntas. */
export const POST_WITH_RELATIONS_SELECT =
  "*, category:blog_categories(*), blog_post_tags(tag:blog_tags(*))";
