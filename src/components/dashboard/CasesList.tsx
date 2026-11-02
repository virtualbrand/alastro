"use client";

import { useEffect, useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import {
  AlertCircle,
  ExternalLink,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import {
  CaseError,
  deleteCase,
  listCases,
  reorderCases,
  setCaseFeatured,
  setCasePublished,
} from "@/services/casesService";
import {
  categoryLabel,
  FEATURED_LIMIT,
  type CaseCategory,
  type CaseRecord,
} from "@/types/case";
import { CaseForm } from "@/components/dashboard/CaseForm";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { SITE_URL } from "@/lib/site";
import { ExpandableSearch } from "@/components/ui/expandable-search";
import { FilterPopover, type FilterMode } from "@/components/ui/filter-popover";
import { ViewSwitcher } from "@/components/ui/view-switcher";
import { listClients } from "@/services/clientsService";
import { setUserPreference } from "@/services/preferencesService";
import { SERVICE_LINKS } from "@/content/service-links";
import { clientTypeLabel } from "@/types/client";
import type { ClientRecord } from "@/types/client";
import type { ViewMode } from "@/lib/view-mode";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { useNotify } from "@/components/ui/notify";
import { WHILE_DRAG } from "@/lib/reorder";
import { Tip } from "@/components/ui/tip";
import { useLastDefined } from "@/hooks/use-last-defined";
import { CasesListSkeleton } from "@/components/dashboard/ListSkeletons";

interface CaseItemProps {
  item: CaseRecord;
  /** "row" é a linha da lista; "card" é o cartão das visualizações em colunas. */
  variant: "row" | "card";
  busy: boolean;
  /** Só na lista sem busca/filtro: reordenar um recorte bagunçaria a ordem geral. */
  reorderable: boolean;
  /** Soltou a linha: grava a ordem atual. */
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  /** A categoria do case já tem o máximo de destaques e este não é um deles. */
  featuredBlocked: boolean;
  onTogglePublished: () => void;
  onCopyError: () => void;
}

const CaseItem = ({
  item,
  variant,
  busy,
  reorderable,
  onDragEnd,
  onEdit,
  onDelete,
  onToggleFeatured,
  featuredBlocked,
  onTogglePublished,
  onCopyError,
}: CaseItemProps) => {
  const controls = useDragControls();
  const isCard = variant === "card";

  const grip = (
    <button
      type="button"
      onPointerDown={reorderable ? (e) => controls.start(e) : undefined}
      aria-disabled={!reorderable}
      aria-label={`Reordenar ${item.title}`}
      className="-mr-2 flex h-9 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing aria-disabled:cursor-not-allowed aria-disabled:opacity-30 aria-disabled:hover:text-muted-foreground"
    >
      <GripVertical className="h-5 w-5" />
    </button>
  );

  const cover = (
    <button
      type="button"
      onClick={onEdit}
      aria-label={`Editar ${item.title}`}
      className={cn(
        "overflow-hidden bg-muted transition-opacity hover:opacity-80",
        isCard ? "block aspect-video w-full" : "h-14 w-20 shrink-0 rounded",
      )}
    >
      {item.cover_url && (
        <img
          src={item.cover_url}
          alt=""
          className="h-full w-full object-cover"
        />
      )}
    </button>
  );

  const info = (
    <div
      className={cn(isCard ? "min-w-0 space-y-1 p-4" : "min-w-[180px] flex-1")}
    >
      <button
        type="button"
        onClick={onEdit}
        className={cn(
          "block text-left font-bold transition-colors hover:text-[hsl(var(--primary-ink))]",
          isCard && "max-w-full truncate",
        )}
      >
        {item.title}
      </button>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className={cn(isCard && "truncate")}>
          /cases/{item.slug}
          {item.client && ` · ${item.client}`}
        </span>
        <CopyLinkButton
          value={`${SITE_URL}/cases/${item.slug}`}
          onError={onCopyError}
        />
      </div>
    </div>
  );

  const featuredLabel = item.featured
    ? "Remover dos destaques"
    : featuredBlocked
      ? `Limite de ${FEATURED_LIMIT} destaques em ${categoryLabel(item.category)} atingido`
      : "Destacar na home";

  const featuredButton = (
    <Tip label={featuredLabel}>
      <button
        type="button"
        disabled={busy}
        // aria-disabled (e não disabled) para o tooltip do motivo continuar aparecendo.
        aria-disabled={featuredBlocked}
        onClick={featuredBlocked ? undefined : onToggleFeatured}
        aria-pressed={item.featured}
        aria-label={featuredLabel}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded transition-colors disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
          item.featured
            ? "text-[hsl(var(--primary-ink))]"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Star className={cn("h-4 w-4", item.featured && "fill-current")} />
      </button>
    </Tip>
  );

  const statusButton = (
    <button
      type="button"
      disabled={busy}
      onClick={onTogglePublished}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-bold transition-colors disabled:opacity-50",
        item.published
          ? "bg-primary/15 text-[hsl(var(--primary-ink))] hover:bg-primary/25"
          : "bg-muted text-muted-foreground hover:bg-muted/70",
      )}
    >
      {item.published ? "Publicado" : "Rascunho"}
    </button>
  );

  const actions = (
    <div className="flex items-center gap-1">
      {item.published && (
        <Tip label={"Ver no site"}>
          <a
            href={`/cases/${item.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Tip>
      )}
      <Tip label={"Editar"}>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </Tip>
      <Tip label={"Excluir"}>
        <button
          type="button"
          disabled={busy}
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </Tip>
    </div>
  );

  if (isCard) {
    return (
      <li className="flex flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground">
        {cover}
        <div className="flex-1">{info}</div>
        <div className="flex items-center gap-1 border-t border-border px-3 py-2">
          {featuredButton}
          {statusButton}
          <div className="ml-auto">{actions}</div>
        </div>
      </li>
    );
  }

  const rowContent = (
    <>
      {grip}
      {cover}
      {info}
      {featuredButton}
      {statusButton}
      {actions}
    </>
  );
  const rowClass =
    "relative flex flex-wrap items-center gap-4 rounded-md border border-border bg-card p-3 text-card-foreground";

  if (!reorderable) return <li className={rowClass}>{rowContent}</li>;

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      whileDrag={WHILE_DRAG}
      className={rowClass}
    >
      {rowContent}
    </Reorder.Item>
  );
};

export const CasesList = ({ initialView }: { initialView: ViewMode }) => {
  const notify = useNotify();
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Case aguardando confirmação de exclusão.
  const [pendingDelete, setPendingDelete] = useState<CaseRecord | null>(null);
  // Painel de edição: "new" para criar, um case para editar, null fechado.
  const [editing, setEditing] = useState<CaseRecord | "new" | null>(null);
  // Conteúdo mantido durante a animação de saída (ver useLastDefined).
  const shownEditing = useLastDefined(editing);
  const shownPending = useLastDefined(pendingDelete);

  // Ids na última ordem gravada e a lista mais recente (o estado só chega aos handlers depois do render).
  const savedIds = useRef<string[]>([]);
  const casesRef = useRef<CaseRecord[]>([]);
  casesRef.current = cases;
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [view, setView] = useState<ViewMode>(initialView);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [clientMode, setClientMode] = useState<FilterMode>("any");
  const [services, setServices] = useState<string[]>([]);
  const [serviceMode, setServiceMode] = useState<FilterMode>("any");

  const load = async () => {
    try {
      const list = await listCases();
      savedIds.current = list.map((c) => c.id);
      casesRef.current = list;
      setCases(list);
      setError(null);
    } catch (err) {
      setError(
        err instanceof CaseError ? err.message : "Não foi possível carregar.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // As opções do filtro de clientes; sem elas o filtro só fica vazio.
    listClients()
      .then(setClients)
      .catch(() => {});
  }, []);

  /** Grava a ordem ao soltar, sem aviso; volta ao que estava salvo se falhar. */
  const persistOrder = async () => {
    const next = casesRef.current;
    const nextIds = next.map((c) => c.id);
    // Ignora ids já excluídos ao comparar com o que estava salvo.
    const previousIds = savedIds.current.filter((id) => nextIds.includes(id));
    if (nextIds.every((id, i) => id === previousIds[i])) return;

    // Marca como salvo já: soltar dispara este handler mais de uma vez.
    savedIds.current = nextIds;
    try {
      await reorderCases(nextIds);
    } catch (err) {
      savedIds.current = previousIds;
      const rollback = [...next].sort(
        (a, b) => previousIds.indexOf(a.id) - previousIds.indexOf(b.id),
      );
      casesRef.current = rollback;
      setCases(rollback);
      const message =
        err instanceof CaseError
          ? err.message
          : "Não foi possível salvar a ordem.";
      setError(message);
      notify.error("Não foi possível salvar a ordem", message);
    }
  };

  /** Troca na hora e grava a preferência do usuário; volta ao anterior se falhar. */
  const changeView = async (next: ViewMode) => {
    if (next === view) return;
    const previous = view;
    setView(next);
    try {
      await setUserPreference("cases.view", next);
    } catch (err) {
      setView(previous);
      notify.error(
        "Não foi possível salvar a visualização",
        err instanceof Error ? err.message : undefined,
      );
    }
  };

  /** Aplica a mudança na tela antes da resposta e desfaz se falhar. */
  const optimistic = async (
    id: string,
    patch: Partial<CaseRecord>,
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    const previous = cases;
    setBusyId(id);
    setCases((list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    try {
      await action();
      notify.success(successMessage);
    } catch (err) {
      setCases(previous);
      const message =
        err instanceof CaseError ? err.message : "Não foi possível atualizar.";
      setError(message);
      notify.error("Não foi possível atualizar o case", message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    const item = pendingDelete;
    if (!item) return;

    setBusyId(item.id);
    try {
      await deleteCase(item.id);
      setCases((list) => list.filter((c) => c.id !== item.id));
      notify.success("Case excluído");
    } catch (err) {
      const message =
        err instanceof CaseError ? err.message : "Não foi possível excluir.";
      setError(message);
      notify.error("Não foi possível excluir o case", message);
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  };

  const normalize = (v: string) =>
    v
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  /** Regra de um grupo: vazio não filtra; OU = algum selecionado; E = todos. */
  const matches = (selected: string[], mode: FilterMode, values: string[]) =>
    selected.length === 0 ||
    (mode === "all"
      ? selected.every((v) => values.includes(v))
      : selected.some((v) => values.includes(v)));

  const otherFilters =
    query.trim() !== "" || clientIds.length > 0 || services.length > 0;
  const filtering = otherFilters || onlyFeatured;

  // Os destaques na ordem geral da lista (a mesma de /cases e da home).
  const featuredOrdered = cases.filter((c) => c.featured);
  // Só os destaques, sem outro filtro e em lista: dá para reordenar a ordem da home.
  const featuredMode = onlyFeatured && !otherFilters && view === "list";

  const visible = (onlyFeatured ? featuredOrdered : cases).filter(
    (c) =>
      normalize(`${c.title} ${c.client ?? ""} ${c.slug}`).includes(
        normalize(query.trim()),
      ) &&
      matches(clientIds, clientMode, c.client_ids ?? []) &&
      matches(services, serviceMode, c.services),
  );

  const clearFilters = () => {
    setOnlyFeatured(false);
    setQuery("");
    setClientIds([]);
    setServices([]);
  };

  // Serviços do site, mais os antigos (texto livre) que ainda existam em algum case.
  const serviceOptions = [
    ...SERVICE_LINKS.map((s) => s.name as string),
    ...Array.from(new Set(cases.flatMap((c) => c.services))).filter(
      (name) => !SERVICE_LINKS.some((s) => s.name === name),
    ),
  ].map((name) => ({ value: name, label: name }));

  /** Quantos destaques cada categoria já tem. */
  const featuredByCategory = cases.reduce<
    Partial<Record<CaseCategory, number>>
  >(
    (acc, c) =>
      c.featured ? { ...acc, [c.category]: (acc[c.category] ?? 0) + 1 } : acc,
    {},
  );
  const isFeaturedFull = (category: CaseCategory) =>
    (featuredByCategory[category] ?? 0) >= FEATURED_LIMIT;

  const renderItem = (
    item: CaseRecord,
    reorderable: boolean,
    onDragEnd: () => void,
  ) => (
    <CaseItem
      key={item.id}
      item={item}
      variant={view === "list" ? "row" : "card"}
      busy={busyId === item.id}
      reorderable={reorderable}
      onDragEnd={onDragEnd}
      onEdit={() => setEditing(item)}
      onDelete={() => setPendingDelete(item)}
      onCopyError={() => setError("Não foi possível copiar o link.")}
      featuredBlocked={!item.featured && isFeaturedFull(item.category)}
      onToggleFeatured={() =>
        optimistic(
          item.id,
          { featured: !item.featured },
          () => setCaseFeatured(item.id, !item.featured),
          item.featured ? "Destaque removido" : "Case em destaque",
        )
      }
      onTogglePublished={() =>
        optimistic(
          item.id,
          { published: !item.published },
          () => setCasePublished(item.id, !item.published),
          item.published ? "Case movido para rascunho" : "Case publicado",
        )
      }
    />
  );

  if (isLoading) return <CasesListSkeleton view={view} />;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        destructive
        isPending={busyId === pendingDelete?.id}
        title="Excluir case"
        description={
          <>
            O case <strong>{shownPending?.title}</strong> será removido junto
            com a galeria e a página pública. Não há como desfazer.
          </>
        }
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />

      <Drawer
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DrawerContent aria-describedby={undefined}>
          {shownEditing !== null && (
            <CaseForm
              key={shownEditing === "new" ? "new" : shownEditing.id}
              record={shownEditing === "new" ? undefined : shownEditing}
              featuredCases={cases.filter((c) => c.featured)}
              onSaved={() => {
                setEditing(null);
                load();
              }}
              onDeleted={(record) => {
                setEditing(null);
                setCases((list) => list.filter((c) => c.id !== record.id));
              }}
            />
          )}
        </DrawerContent>
      </Drawer>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cases</h1>
          <p className="text-sm text-muted-foreground">
            {cases.length === 0
              ? "Nenhum case cadastrado ainda."
              : filtering
                ? `${visible.length} de ${cases.length} cases`
                : `${cases.length} ${cases.length === 1 ? "case" : "cases"}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cases.length > 0 && (
            <>
              <ExpandableSearch
                value={query}
                onChange={setQuery}
                placeholder="Buscar por título"
                label="Buscar case"
              />
              <Tip
                label={
                  onlyFeatured
                    ? "Mostrando só os destaques (clique para ver todos)"
                    : "Mostrar só os destaques"
                }
              >
                <button
                  type="button"
                  onClick={() => setOnlyFeatured((v) => !v)}
                  aria-pressed={onlyFeatured}
                  aria-label="Mostrar só os destaques"
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-[hsl(var(--field))] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    onlyFeatured &&
                      "border-[hsl(var(--primary-ink))] text-[hsl(var(--primary-ink))]",
                  )}
                >
                  <Star
                    className={cn("h-4 w-4", onlyFeatured && "fill-current")}
                  />
                </button>
              </Tip>
              <FilterPopover
                groups={[
                  {
                    id: "clients",
                    label: "Cliente",
                    options: clients.map((c) => ({
                      value: c.id,
                      label: c.name,
                      hint: clientTypeLabel(c.type),
                    })),
                    selected: clientIds,
                    onChange: setClientIds,
                    mode: clientMode,
                    onModeChange: setClientMode,
                  },
                  {
                    id: "services",
                    label: "Serviço",
                    options: serviceOptions,
                    selected: services,
                    onChange: setServices,
                    mode: serviceMode,
                    onModeChange: setServiceMode,
                  },
                ]}
              />
              <ViewSwitcher value={view} onChange={changeView} />
            </>
          )}
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-transparent bg-primary px-5 text-sm font-bold uppercase text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Case
          </button>
        </div>
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

      {cases.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Cadastre o primeiro projeto para começar a montar a prova social.
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum case encontrado com esses critérios.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 text-sm font-bold underline-offset-2 hover:underline"
          >
            Limpar busca e filtros
          </button>
        </div>
      ) : featuredMode ? (
        <Reorder.Group
          as="ul"
          axis="y"
          values={featuredOrdered}
          onReorder={(next) => {
            // Só os destaques foram reordenados: eles ocupam as mesmas posições
            // que já tinham na lista geral, na nova sequência; os demais ficam onde estão.
            let i = 0;
            const merged = casesRef.current.map((c) =>
              c.featured ? next[i++] : c,
            );
            casesRef.current = merged;
            setCases(merged);
          }}
          className="space-y-2"
        >
          {featuredOrdered.map((item) => renderItem(item, true, persistOrder))}
        </Reorder.Group>
      ) : view === "list" && !filtering ? (
        <Reorder.Group
          as="ul"
          axis="y"
          values={cases}
          onReorder={(next) => {
            casesRef.current = next;
            setCases(next);
          }}
          className="space-y-2"
        >
          {cases.map((item) => renderItem(item, true, persistOrder))}
        </Reorder.Group>
      ) : (
        <ul
          className={cn(
            view === "list"
              ? "space-y-2"
              : "grid grid-cols-1 gap-3 md:grid-cols-2",
            view === "grid-3" && "lg:grid-cols-3",
          )}
        >
          {visible.map((item) => renderItem(item, false, persistOrder))}
        </ul>
      )}
    </div>
  );
};
