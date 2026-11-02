"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, Plus, X } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Dropdown } from "@/components/dashboard/Dropdown";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import {
  BlogError,
  createCategory,
  createPost,
  findOrCreateTag,
  listCategories,
  listTags,
  updatePost,
} from "@/services/blogService";
import { slugify } from "@/lib/slug";
import type {
  BlogCategory,
  BlogPostInput,
  BlogPostWithRelations,
  BlogTag,
} from "@/types/blog";
import { useNotify } from "@/components/ui/notify";

const Field = ({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <label className="block space-y-1.5">
    <span className="block text-xs font-bold uppercase tracking-wide">
      {label}
    </span>
    {children}
    {hint && !error && (
      <span className="block text-xs text-muted-foreground">{hint}</span>
    )}
    {error && <span className="block text-xs text-destructive">{error}</span>}
  </label>
);

const inputClass =
  "h-11 w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]";

const emptyPost: BlogPostInput = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_url: null,
  author_name: "",
  category_id: null,
  published: false,
};

export const PostForm = ({ record }: { record?: BlogPostWithRelations }) => {
  const router = useRouter();
  const notify = useNotify();
  const isEditing = Boolean(record);

  const [form, setForm] = useState<BlogPostInput>(
    record
      ? {
          slug: record.slug,
          title: record.title,
          excerpt: record.excerpt ?? "",
          content: record.content ?? "",
          cover_url: record.cover_url,
          author_name: record.author_name ?? "",
          category_id: record.category_id,
          published: record.published,
        }
      : emptyPost,
  );

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>(record?.tags ?? []);
  const [allTags, setAllTags] = useState<BlogTag[]>([]);

  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [tagDraft, setTagDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, allExisting] = await Promise.all([
          listCategories(),
          listTags(),
        ]);
        setCategories(cats);
        setAllTags(allExisting);
      } catch (err) {
        setError(
          err instanceof BlogError
            ? err.message
            : "Falha ao carregar os dados.",
        );
      }
    };
    load();
  }, []);

  const set = <K extends keyof BlogPostInput>(
    key: K,
    value: BlogPostInput[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const handleTitle = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: slugLocked ? current.slug : slugify(title),
    }));
  };

  const handleAddTag = async () => {
    const name = tagDraft.trim();
    setTagDraft("");
    if (!name) return;
    if (tags.some((t) => t.slug === slugify(name))) return;

    try {
      const tag = await findOrCreateTag(name);
      setTags((current) => [...current, tag]);
      setAllTags((current) =>
        current.some((t) => t.id === tag.id) ? current : [...current, tag],
      );
    } catch (err) {
      setError(
        err instanceof BlogError ? err.message : "Falha ao criar a tag.",
      );
    }
  };

  const handleAddCategory = async () => {
    const name = categoryDraft.trim();
    if (!name) return;
    try {
      const category = await createCategory(name);
      setCategories((current) => [...current, category]);
      set("category_id", category.id);
      setCategoryDraft("");
      setAddingCategory(false);
    } catch (err) {
      setError(
        err instanceof BlogError ? err.message : "Falha ao criar a categoria.",
      );
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Informe o título.";
    if (!form.slug.trim()) next.slug = "Informe a URL.";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      next.slug = "Use apenas letras minúsculas, números e hífens.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setError(null);

    const payload: BlogPostInput = {
      ...form,
      slug: form.slug.replace(/-+$/, ""),
      excerpt: form.excerpt?.trim() || null,
      author_name: form.author_name?.trim() || null,
    };
    const tagIds = tags.map((t) => t.id);

    try {
      if (record) await updatePost(record.id, payload, tagIds);
      else await createPost(payload, tagIds);
      notify.success("Artigo salvo");

      router.push("/dashboard/blog");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof BlogError
          ? err.message
          : "Não foi possível salvar agora. Tente novamente.";
      setError(message);
      notify.error("Não foi possível salvar", message);
    } finally {
      setIsSaving(false);
    }
  };

  // Sugestões: tags já existentes que ainda não estão neste artigo.
  const suggestions = allTags.filter(
    (tag) => !tags.some((selected) => selected.id === tag.id),
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          {/* O último item acompanha o campo de título enquanto ele é digitado. */}
          <Breadcrumb
            items={[
              { label: "Blog", href: "/dashboard/blog" },
              {
                label:
                  form.title.trim() ||
                  (isEditing ? "Editar artigo" : "Novo artigo"),
              },
            ]}
            className="text-foreground"
          />
          <h1 className="text-2xl font-bold">
            {isEditing ? "Editar artigo" : "Novo artigo"}
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-md border border-transparent bg-primary px-6 py-3 text-sm font-bold uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {isSaving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Field label="Título" error={fieldErrors.title}>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Título do artigo"
            />
          </Field>

          <Field
            label="URL"
            hint={`O artigo ficará em /blog/${form.slug || "..."}`}
            error={fieldErrors.slug}
          >
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => {
                setSlugLocked(true);
                set(
                  "slug",
                  slugify(e.target.value, { keepTrailingHyphen: true }),
                );
              }}
              placeholder="titulo-do-artigo"
            />
          </Field>

          <Field
            label="Resumo"
            hint="Aparece na listagem, na busca e na prévia ao compartilhar."
          >
            <textarea
              className="min-h-[90px] w-full resize-y rounded-md border border-border bg-[hsl(var(--field))] px-3 py-2 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]"
              value={form.excerpt ?? ""}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Uma ou duas frases sobre o artigo"
            />
          </Field>

          <div className="space-y-1.5">
            <span className="block text-xs font-bold uppercase tracking-wide">
              Conteúdo
            </span>
            <RichTextEditor
              value={form.content ?? ""}
              onChange={(html) => set("content", html)}
              placeholder="Escreva o artigo..."
              onUploadError={setError}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 rounded-md border border-border bg-[hsl(var(--panel))] p-4 text-card-foreground">
            <label className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold">Publicado</span>
              <Switch
                checked={form.published}
                onCheckedChange={(v) => set("published", v)}
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Enquanto estiver desligado, o artigo fica como rascunho e não
              aparece em /blog.
            </p>
          </div>

          <ImageUpload
            label="Imagem de capa"
            value={form.cover_url}
            onChange={(url) => set("cover_url", url)}
            folder="blog"
            hint="Usada na listagem e no topo do artigo."
          />

          <Field label="Autor" hint="Deixe vazio para assinar como Alastro.">
            <input
              className={inputClass}
              value={form.author_name ?? ""}
              onChange={(e) => set("author_name", e.target.value)}
              placeholder="Nome de quem escreveu"
            />
          </Field>

          {/* Categoria */}
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wide">
              Categoria
            </span>
            {addingCategory ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  className={inputClass}
                  value={categoryDraft}
                  onChange={(e) => setCategoryDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                    if (e.key === "Escape") setAddingCategory(false);
                  }}
                  placeholder="Nome da categoria"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  aria-label="Criar categoria"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-[hsl(var(--primary-ink))]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Dropdown
                  value={form.category_id ?? "none"}
                  onChange={(value) =>
                    set("category_id", value === "none" ? null : value)
                  }
                  options={[
                    { value: "none", label: "Sem categoria" },
                    ...categories.map((category) => ({
                      value: category.id,
                      label: category.name,
                    })),
                  ]}
                />
                <button
                  type="button"
                  onClick={() => setAddingCategory(true)}
                  className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-[hsl(var(--primary-ink))] hover:underline"
                >
                  Criar nova categoria
                </button>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wide">
              Tags
            </span>
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Documentário, bastidores..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                aria-label="Adicionar tag"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-[hsl(var(--primary-ink))]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setTags((current) =>
                          current.filter((t) => t.id !== tag.id),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {tag.name}
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="block text-xs text-muted-foreground">
                  Tags já usadas
                </span>
                <ul className="flex flex-wrap gap-1.5">
                  {suggestions.slice(0, 12).map((tag) => (
                    <li key={tag.id}>
                      <button
                        type="button"
                        onClick={() => setTags((current) => [...current, tag])}
                        className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-[hsl(var(--primary-ink))]"
                      >
                        {tag.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
