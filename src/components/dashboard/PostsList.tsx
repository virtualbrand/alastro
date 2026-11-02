"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  BlogError,
  deletePost,
  listPosts,
  setPostPublished,
} from "@/services/blogService";
import type { BlogPostWithRelations } from "@/types/blog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { useNotify } from "@/components/ui/notify";
import { Tip } from "@/components/ui/tip";
import { useLastDefined } from "@/hooks/use-last-defined";
import { PostsListSkeleton } from "@/components/dashboard/ListSkeletons";

export const PostsList = () => {
  const notify = useNotify();
  const [posts, setPosts] = useState<BlogPostWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Artigo aguardando confirmação de exclusão.
  const [pendingDelete, setPendingDelete] =
    useState<BlogPostWithRelations | null>(null);
  // Conteúdo mantido durante a animação de saída (ver useLastDefined).
  const shownPending = useLastDefined(pendingDelete);

  useEffect(() => {
    const load = async () => {
      try {
        setPosts(await listPosts());
        setError(null);
      } catch (err) {
        setError(
          err instanceof BlogError ? err.message : "Não foi possível carregar.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleTogglePublished = async (post: BlogPostWithRelations) => {
    const previous = posts;
    setBusyId(post.id);
    setPosts((list) =>
      list.map((item) =>
        item.id === post.id ? { ...item, published: !item.published } : item,
      ),
    );
    try {
      await setPostPublished(post.id, !post.published);
      notify.success(
        post.published ? "Artigo movido para rascunho" : "Artigo publicado",
      );
    } catch (err) {
      setPosts(previous);
      const message =
        err instanceof BlogError ? err.message : "Não foi possível atualizar.";
      setError(message);
      notify.error("Não foi possível atualizar o artigo", message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    const post = pendingDelete;
    if (!post) return;

    setBusyId(post.id);
    try {
      await deletePost(post.id);
      setPosts((list) => list.filter((p) => p.id !== post.id));
      notify.success("Artigo excluído");
    } catch (err) {
      const message =
        err instanceof BlogError ? err.message : "Não foi possível excluir.";
      setError(message);
      notify.error("Não foi possível excluir o artigo", message);
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  };

  if (isLoading) return <PostsListSkeleton />;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        destructive
        isPending={busyId === pendingDelete?.id}
        title="Excluir artigo"
        description={
          <>
            O artigo <strong>{shownPending?.title}</strong> será removido junto
            com os vínculos de tags. Não há como desfazer.
          </>
        }
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground">
            {posts.length === 0
              ? "Nenhum artigo criado ainda."
              : `${posts.length} ${posts.length === 1 ? "artigo" : "artigos"}`}
          </p>
        </div>

        <Link
          href="/dashboard/blog/novo"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Artigo
        </Link>
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

      {posts.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Escreva o primeiro artigo para dar início ao blog.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-card p-3 text-card-foreground"
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded bg-muted">
                {post.cover_url && (
                  <img
                    src={post.cover_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-[200px] flex-1">
                <p className="font-bold">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                  /blog/{post.slug}
                  {post.category && ` · ${post.category.name}`}
                </p>
                {post.tags.length > 0 && (
                  <ul className="mt-1 flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <li
                        key={tag.id}
                        className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                disabled={busyId === post.id}
                onClick={() => handleTogglePublished(post)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold transition-colors disabled:opacity-50",
                  post.published
                    ? "bg-primary/15 text-[hsl(var(--primary-ink))] hover:bg-primary/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
                )}
              >
                {post.published ? "Publicado" : "Rascunho"}
              </button>

              <div className="flex items-center gap-1">
                {post.published && (
                  <Tip label={"Ver no site"}>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Tip>
                )}
                <Tip label={"Editar"}>
                  <Link
                    href={`/dashboard/blog/${post.id}`}
                    className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Tip>
                <Tip label={"Excluir"}>
                  <button
                    type="button"
                    disabled={busyId === post.id}
                    onClick={() => setPendingDelete(post)}
                    className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Tip>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
