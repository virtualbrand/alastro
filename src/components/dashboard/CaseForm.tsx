"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  FileText,
  Images,
  Info,
  Loader2,
  Trash2,
  Plus,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICE_LINKS } from "@/content/service-links";
import { TagInput } from "@/components/ui/tag-input";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { SITE_URL } from "@/lib/site";
import {
  MultiSearchSelect,
  type SelectOption,
} from "@/components/ui/multi-search-select";
import { ClientForm } from "@/components/dashboard/ClientForm";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Modal, ModalContent } from "@/components/ui/modal";
import { listClients } from "@/services/clientsService";
import { clientTypeLabel, type ClientRecord } from "@/types/client";
import { useFileDrop } from "@/hooks/use-file-drop";
import { toEmbedUrl } from "@/lib/video";
import { RadioCardGroup } from "@/components/ui/radio-card-group";
import { VideoUpload } from "@/components/ui/video-upload";
import { Switch } from "@/components/ui/switch";
import { uploadImage, UploadError } from "@/services/storageService";
import {
  CaseError,
  createCase,
  deleteCase,
  updateCase,
  listCaseTags,
} from "@/services/casesService";
import { slugify } from "@/lib/slug";
import { CASE_CATEGORIES, categoryLabel, FEATURED_LIMIT } from "@/types/case";
import type { CaseInput, CaseRecord } from "@/types/case";
import { useNotify } from "@/components/ui/notify";
import { useLastDefined } from "@/hooks/use-last-defined";
import { Tip } from "@/components/ui/tip";

const Field = ({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
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

const SERVICE_OPTIONS: SelectOption[] = SERVICE_LINKS.map((s) => ({
  value: s.name,
  label: s.name,
}));

const TABS = [
  { id: "info", label: "Informações", icon: Info },
  { id: "content", label: "Conteúdo", icon: FileText },
  { id: "media", label: "Mídia", icon: Images },
] as const;

type TabId = (typeof TABS)[number]["id"];

const inputClass =
  "h-11 w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]";

const emptyCase: CaseInput = {
  slug: "",
  title: "",
  category: "case",
  client_ids: [],
  summary: "",
  content: "",
  cover_url: null,
  hover_video_webm_url: null,
  hover_video_mp4_url: null,
  gallery: [],
  video_url: "",
  services: [],
  tags: [],
  published: false,
  featured: false,
  featured_rank: null,
};

interface CaseFormProps {
  record?: CaseRecord;
  /** Chamado depois de salvar, para a lista recarregar e fechar o painel. */
  onSaved: () => void;
  /** Chamado depois de excluir (só na edição), para a lista remover o item. */
  onDeleted?: (record: CaseRecord) => void;
  /** Cases já em destaque, para respeitar o limite por categoria. */
  featuredCases: Pick<CaseRecord, "id" | "category">[];
}

/** Formulário de case; deve ser renderizado dentro de um DrawerContent. */
export const CaseForm = ({
  record,
  onSaved,
  onDeleted,
  featuredCases,
}: CaseFormProps) => {
  const isEditing = Boolean(record);
  const notify = useNotify();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!record) return;
    setIsDeleting(true);
    try {
      await deleteCase(record.id);
      notify.success("Case excluído");
      onDeleted?.(record);
    } catch (err) {
      setConfirmingDelete(false);
      const message =
        err instanceof CaseError
          ? err.message
          : "Não foi possível excluir agora. Tente novamente.";
      setError(message);
      notify.error("Não foi possível excluir o case", message);
    } finally {
      setIsDeleting(false);
    }
  };

  const [form, setForm] = useState<CaseInput>(
    record
      ? {
          slug: record.slug,
          title: record.title,
          category: record.category ?? "case",
          client_ids: record.client_ids ?? [],
          summary: record.summary ?? "",
          content: record.content ?? "",
          cover_url: record.cover_url,
          hover_video_webm_url: record.hover_video_webm_url,
          hover_video_mp4_url: record.hover_video_mp4_url,
          gallery: record.gallery ?? [],
          video_url: record.video_url ?? "",
          services: record.services ?? [],
          tags: record.tags ?? [],
          published: record.published,
          featured: record.featured,
          featured_rank: record.featured_rank,
        }
      : emptyCase,
  );

  // Enquanto o slug não for editado à mão, ele acompanha o título.
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  useEffect(() => {
    // Sugestões são só conveniência: se falhar, o campo segue aceitando texto livre.
    listCaseTags().then(setTagSuggestions).catch(() => {});
  }, []);

  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState<TabId>("info");

  const [clientOptions, setClientOptions] = useState<SelectOption[]>([]);
  // Nome digitado sem resultado: abre o cadastro de cliente por cima do drawer.
  const [newClientName, setNewClientName] = useState<string | null>(null);
  // Conteúdo mantido durante a animação de saída (ver useLastDefined).
  const shownNewClientName = useLastDefined(newClientName);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const toOption = (c: ClientRecord): SelectOption => ({
    value: c.id,
    label: c.name,
    hint: clientTypeLabel(c.type),
    imageUrl: c.photo_url,
  });

  useEffect(() => {
    listClients()
      .then((clients) => setClientOptions(clients.map(toOption)))
      .catch(() => {})
      .finally(() => setClientsLoaded(true));
  }, []);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof CaseInput>(key: K, value: CaseInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleTitle = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: slugLocked ? current.slug : slugify(title),
    }));
  };

  /** Sobe uma ou várias imagens em sequência e as acrescenta de uma vez à galeria. */
  const handleGalleryFiles = async (files: File[]) => {
    const urls: string[] = [];
    try {
      for (const file of files) {
        urls.push(await uploadImage(file, "cases/galeria"));
      }
    } catch (err) {
      setError(
        err instanceof UploadError ? err.message : "Falha ao enviar a imagem.",
      );
    } finally {
      if (urls.length > 0) {
        setForm((current) => ({
          ...current,
          gallery: [...current.gallery, ...urls],
        }));
      }
    }
  };

  // Reordenação da galeria arrastando as miniaturas (drag and drop nativo).
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const endGalleryDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const moveGalleryItem = (from: number, to: number) => {
    if (from === to) return;
    setForm((current) => {
      const next = [...current.gallery];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...current, gallery: next };
    });
  };

  const { isDragging: isGalleryDragging, dropProps: galleryDropProps } =
    useFileDrop(handleGalleryFiles);

  // Campos obrigatórios, calculados a cada render: o Salvar só habilita quando estão ok.
  const requiredMissing: string[] = [];
  if (!form.title.trim()) requiredMissing.push("Título");
  if (!form.slug.replace(/-+$/, "")) requiredMissing.push("URL");

  // Publicar ou destacar exige o case completo, porque aparece no site.
  const publishing = form.published || form.featured;
  const publishMissing: string[] = [];
  if (form.client_ids.length === 0) publishMissing.push("Clientes");
  if (form.services.length === 0) publishMissing.push("Serviços");
  if (!toEmbedUrl(form.video_url?.trim() || null))
    publishMissing.push("Vídeo (link válido do YouTube ou Vimeo)");
  if (!form.cover_url) publishMissing.push("Imagem de capa");
  if (!form.hover_video_webm_url && !form.hover_video_mp4_url)
    publishMissing.push("Vídeo do card (WebM ou MP4)");

  // Limite de destaques da categoria escolhida (sem contar este próprio case).
  const othersFeatured = featuredCases.filter(
    (c) => c.id !== record?.id && c.category === form.category,
  ).length;
  const featuredFull = othersFeatured >= FEATURED_LIMIT;
  const featuredBlockReason =
    form.featured && featuredFull
      ? `A categoria ${categoryLabel(form.category)} já tem ${FEATURED_LIMIT} destaques. Remova um deles antes de destacar este case.`
      : null;

  const missing = [...requiredMissing, ...(publishing ? publishMissing : [])];
  const canSave = missing.length === 0 && !featuredBlockReason && !isSaving;
  const publishAction = form.published
    ? form.featured
      ? "publicar e destacar"
      : "publicar"
    : "destacar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) {
      if (requiredMissing.length > 0) setTab("info");
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload: CaseInput = {
      ...form,
      slug: form.slug.replace(/-+$/, ""),
      summary: form.summary?.trim() || null,
      video_url: form.video_url?.trim() || null,
      featured_rank: form.featured ? form.featured_rank : null,
    };

    try {
      if (record) await updateCase(record.id, payload);
      else await createCase(payload);
      notify.success("Case salvo");

      onSaved();
    } catch (err) {
      const message =
        err instanceof CaseError
          ? err.message
          : "Não foi possível salvar agora. Tente novamente.";
      setError(message);
      notify.error("Não foi possível salvar", message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <DrawerHeader
          actions={
            <>
              <label className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {form.published ? "Publicado" : "Rascunho"}
                </span>
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => set("published", v)}
                />
              </label>
              <Tip
                label={
                  form.featured
                    ? "Remover dos destaques"
                    : featuredFull
                      ? `Limite de ${FEATURED_LIMIT} destaques em ${categoryLabel(form.category)} atingido`
                      : "Destacar na home"
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!form.featured && featuredFull) return;
                    set("featured", !form.featured);
                  }}
                  aria-pressed={form.featured}
                  aria-disabled={!form.featured && featuredFull}
                  aria-label="Destaque na home"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
                    form.featured
                      ? "text-[hsl(var(--primary-ink))]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Star
                    className={cn("h-5 w-5", form.featured && "fill-current")}
                  />
                </button>
              </Tip>
            </>
          }
        >
          <DrawerTitle className="text-xl font-bold">
            {isEditing ? "Editar case" : "Novo case"}
          </DrawerTitle>
          <p className="text-xs text-muted-foreground">
            {form.title.trim() || "Sem título"}
          </p>
        </DrawerHeader>

        <div
          role="tablist"
          aria-label="Seções do case"
          className="flex flex-wrap items-center gap-1 border-b border-border px-6 py-2"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`case-tab-${id}-trigger`}
                aria-selected={active}
                aria-controls={`case-tab-${id}`}
                onClick={() => setTab(id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {featuredBlockReason && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-md border border-border bg-muted px-4 py-3"
            >
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <p className="text-sm">
                {featuredBlockReason} Ou desligue a estrela de destaque para
                salvar.
              </p>
            </div>
          )}

          {publishing && publishMissing.length > 0 && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-md border border-border bg-muted px-4 py-3"
            >
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <p className="text-sm">
                Para {publishAction} este case, preencha:{" "}
                <strong>{publishMissing.join(", ")}</strong>.{" "}
                {form.published
                  ? "Ou desligue Publicado e a estrela de destaque para salvar como rascunho."
                  : "Ou desligue a estrela de destaque para salvar sem destaque."}
              </p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div
            role="tabpanel"
            id="case-tab-info"
            aria-labelledby="case-tab-info-trigger"
            hidden={tab !== "info"}
            className="space-y-6"
          >
            <Field label="Título">
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => handleTitle(e.target.value)}
                placeholder="Nome do projeto"
              />
            </Field>

            <Field
              label="URL"
              hint={
                <span className="flex items-center gap-1">
                  <span className="truncate">
                    {SITE_URL}/cases/{form.slug || "..."}
                  </span>
                  {form.slug && (
                    <CopyLinkButton value={`${SITE_URL}/cases/${form.slug}`} />
                  )}
                </span>
              }
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
                placeholder="nome-do-projeto"
              />
            </Field>

            <RadioCardGroup
              label="Categoria"
              options={CASE_CATEGORIES}
              value={form.category}
              onChange={(category) => set("category", category)}
            />

            {/* Clientes vinculados */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wide">
                Clientes
              </span>
              <MultiSearchSelect
                options={clientOptions}
                selected={form.client_ids}
                onChange={(ids) => set("client_ids", ids)}
                onCreate={setNewClientName}
                placeholder="Buscar e selecionar cliente..."
                loading={!clientsLoaded}
                emptyText="Nenhum cliente encontrado. Cadastre em Clientes."
              />
              {isEditing && form.client_ids.length === 0 && record?.client && (
                <p className="text-xs text-muted-foreground">
                  Cliente atual (texto livre): {record.client}. Vincule um
                  cliente cadastrado para substituí-lo.
                </p>
              )}
            </div>

            {/* Serviços */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wide">
                Serviços
              </span>
              <MultiSearchSelect
                options={SERVICE_OPTIONS}
                selected={form.services}
                onChange={(services) => set("services", services)}
                placeholder="Buscar e selecionar serviço..."
                emptyText="Nenhum serviço encontrado"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wide">
                Tags
              </span>
              <TagInput
                value={form.tags}
                onChange={(tags) => set("tags", tags)}
                suggestions={tagSuggestions}
              />
            </div>
          </div>

          <div
            role="tabpanel"
            id="case-tab-content"
            aria-labelledby="case-tab-content-trigger"
            hidden={tab !== "content"}
            className="space-y-6"
          >
            <Field
              label="Resumo"
              hint="Aparece nos cards da listagem e na prévia ao compartilhar."
            >
              <textarea
                className="min-h-[90px] w-full resize-y rounded-md border border-border bg-[hsl(var(--field))] px-3 py-2 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]"
                value={form.summary ?? ""}
                onChange={(e) => set("summary", e.target.value)}
                placeholder="Uma ou duas frases sobre o projeto"
              />
            </Field>

            <div className="space-y-1.5">
              <span className="block text-xs font-bold uppercase tracking-wide">
                Conteúdo
              </span>
              <RichTextEditor
                value={form.content ?? ""}
                onChange={(html) => set("content", html)}
                placeholder="Conte a história do projeto..."
                onUploadError={setError}
              />
            </div>
          </div>

          <div
            role="tabpanel"
            id="case-tab-media"
            aria-labelledby="case-tab-media-trigger"
            hidden={tab !== "media"}
            className="space-y-6"
          >
            <Field label="Vídeo" hint="Link do YouTube ou Vimeo.">
              <input
                className={inputClass}
                value={form.video_url ?? ""}
                onChange={(e) => set("video_url", e.target.value)}
                placeholder="https://..."
              />
            </Field>

            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
              <ImageUpload
                label="Imagem de capa"
                value={form.cover_url}
                onChange={(url) => set("cover_url", url)}
                hint="Usada nos cards e no topo da página do case."
              />

              {/* Galeria */}
              <div className="space-y-2">
                <span className="block text-xs font-bold uppercase tracking-wide">
                  Galeria
                </span>
                {form.gallery.length > 0 && (
                  <ul className="grid grid-cols-3 gap-2">
                    {form.gallery.map((url, index) => (
                      <li
                        key={url}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", String(index));
                          setDragIndex(index);
                        }}
                        onDragOver={(event) => {
                          if (dragIndex === null) return;
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                          setOverIndex(index);
                        }}
                        onDrop={(event) => {
                          if (dragIndex === null) return;
                          event.preventDefault();
                          moveGalleryItem(dragIndex, index);
                          endGalleryDrag();
                        }}
                        onDragEnd={endGalleryDrag}
                        className={cn(
                          "relative cursor-grab active:cursor-grabbing",
                          dragIndex === index && "opacity-40",
                          overIndex === index &&
                            dragIndex !== null &&
                            dragIndex !== index &&
                            "rounded ring-2 ring-[hsl(var(--primary-ink))]",
                        )}
                      >
                        <img
                          src={url}
                          alt=""
                          draggable={false}
                          className="h-20 w-full rounded border border-border bg-muted object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            set(
                              "gallery",
                              form.gallery.filter((item) => item !== url),
                            )
                          }
                          aria-label="Remover da galeria"
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background text-foreground shadow transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <label
                  {...galleryDropProps}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-border py-3 text-xs text-muted-foreground transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-foreground",
                    isGalleryDragging &&
                      "border-[hsl(var(--primary-ink))] bg-muted text-foreground",
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {isGalleryDragging
                    ? "Solte para adicionar"
                    : "Adicionar imagens (clique ou arraste)"}
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length > 0) handleGalleryFiles(files);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
              <VideoUpload
                label="Vídeo do card (WebM)"
                format="webm"
                value={form.hover_video_webm_url}
                onChange={(url) => set("hover_video_webm_url", url)}
                hint="Tocado primeiro, quando o navegador suporta."
              />

              <VideoUpload
                label="Vídeo do card (MP4)"
                format="mp4"
                value={form.hover_video_mp4_url}
                onChange={(url) => set("hover_video_mp4_url", url)}
                hint="Alternativa para navegadores sem WebM. Aparece no lugar da capa quando o card recebe hover."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          {record && (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-md border border-destructive px-6 py-3 text-sm font-bold uppercase text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          )}
          {missing.length > 0 ? (
            <p className="mr-auto text-xs text-muted-foreground">
              Para salvar, preencha: {missing.join(", ")}.
            </p>
          ) : (
            featuredBlockReason && (
              <p className="mr-auto text-xs text-muted-foreground">
                {featuredBlockReason}
              </p>
            )
          )}
          <button
            type="submit"
            disabled={!canSave}
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
      </form>

      <Modal
        open={newClientName !== null}
        onOpenChange={(open) => !open && setNewClientName(null)}
      >
        <ModalContent aria-describedby={undefined}>
          {shownNewClientName !== null && (
            <ClientForm
              initialName={shownNewClientName}
              onSaved={(client) => {
                setClientOptions((options) => [...options, toOption(client)]);
                set("client_ids", [...form.client_ids, client.id]);
                setNewClientName(null);
              }}
            />
          )}
        </ModalContent>
      </Modal>

      {record && (
        <ConfirmDialog
          open={confirmingDelete}
          onOpenChange={setConfirmingDelete}
          destructive
          isPending={isDeleting}
          title="Excluir case"
          description={
            <>
              O case <strong>{record.title}</strong> será removido junto com a
              galeria e a página pública. Não há como desfazer.
            </>
          }
          confirmLabel="Excluir"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
