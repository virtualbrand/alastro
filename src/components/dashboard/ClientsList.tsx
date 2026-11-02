"use client";

import { useEffect, useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import {
  AlertCircle,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  ClientError,
  deleteClientRecord,
  listClients,
  setClientShowOnHome,
  reorderClients,
} from "@/services/clientsService";
import { clientTypeLabel } from "@/types/client";
import type { ClientRecord, ClientType } from "@/types/client";
import { Switch } from "@/components/ui/switch";
import { ViewSwitcher } from "@/components/ui/view-switcher";
import { setUserPreference } from "@/services/preferencesService";
import type { ViewMode } from "@/lib/view-mode";
import { cn } from "@/lib/utils";
import { ClientsToolbar } from "@/components/dashboard/ClientsToolbar";
import { ClientForm } from "@/components/dashboard/ClientForm";
import { Modal, ModalContent } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useNotify } from "@/components/ui/notify";
import { WHILE_DRAG } from "@/lib/reorder";
import { Tip } from "@/components/ui/tip";
import { useLastDefined } from "@/hooks/use-last-defined";
import { ClientsListSkeleton } from "@/components/dashboard/ListSkeletons";

interface ClientRowProps {
  item: ClientRecord;
  /** "row" é a linha da lista; "card" é o cartão compacto das visualizações em colunas. */
  variant?: "row" | "card";
  /** Falso com busca/filtro ou em colunas: reordenar um recorte bagunçaria a ordem geral. */
  reorderable: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleHome: () => void;
  /** Soltou a linha: grava a ordem atual. */
  onDragEnd: () => void;
}

const ROW_CLASS =
  "relative flex flex-wrap items-center gap-4 rounded-md border border-border bg-card p-3 text-card-foreground";
const CARD_CLASS =
  "relative flex items-center gap-4 rounded-md border border-border bg-card p-3 text-card-foreground";

/** Linha arrastável pela alça; o resto da linha continua clicável normalmente. */
const ClientRow = ({
  item,
  variant = "row",
  reorderable,
  onEdit,
  onDelete,
  onToggleHome,
  onDragEnd,
}: ClientRowProps) => {
  const controls = useDragControls();
  const isCard = variant === "card";

  const photo = (
    <button
      type="button"
      onClick={onEdit}
      aria-label={`Editar ${item.name}`}
      className={cn(
        "shrink-0 overflow-hidden rounded bg-muted transition-opacity hover:opacity-80",
        isCard ? "h-16 w-16" : "h-14 w-14",
        !item.show_on_home && "opacity-50",
      )}
    >
      {item.photo_url && (
        <img
          src={item.photo_url}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
        />
      )}
    </button>
  );

  const badge = (
    <span
      className={cn(
        "shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground",
        isCard && "mt-1 inline-block",
      )}
    >
      {clientTypeLabel(item.type)}
    </span>
  );

  const homeSwitch = (
    <Tip
      label={
        item.show_on_home
          ? "Aparece no carrossel da home"
          : "Oculto no carrossel da home"
      }
    >
      <label className="flex cursor-pointer items-center">
        <Switch
          checked={item.show_on_home}
          onCheckedChange={onToggleHome}
          aria-label={`Mostrar ${item.name} na home`}
        />
      </label>
    </Tip>
  );

  const actions = (
    <div className="flex items-center gap-1">
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
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </Tip>
    </div>
  );

  if (isCard) {
    return (
      <li className={CARD_CLASS}>
        {photo}
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onEdit}
            className="block max-w-full truncate text-left font-bold transition-colors hover:text-[hsl(var(--primary-ink))]"
          >
            {item.name}
          </button>
          {badge}
        </div>
        {homeSwitch}
        {actions}
      </li>
    );
  }

  const content = (
    <>
      <button
        type="button"
        onPointerDown={reorderable ? (e) => controls.start(e) : undefined}
        aria-disabled={!reorderable}
        aria-label={`Reordenar ${item.name}`}
        className="-mr-2 flex h-9 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing aria-disabled:cursor-not-allowed aria-disabled:opacity-30 aria-disabled:hover:text-muted-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {photo}

      <div className="flex min-w-[180px] flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="block text-left font-bold transition-colors hover:text-[hsl(var(--primary-ink))]"
        >
          {item.name}
        </button>
        {badge}
      </div>

      {homeSwitch}
      {actions}
    </>
  );

  if (!reorderable) return <li className={ROW_CLASS}>{content}</li>;

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      whileDrag={WHILE_DRAG}
      className={ROW_CLASS}
    >
      {content}
    </Reorder.Item>
  );
};

export const ClientsList = ({ initialView }: { initialView: ViewMode }) => {
  const notify = useNotify();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  // Ordem mais recente (o estado só chega ao handler de soltar depois do render).
  const [view, setView] = useState<ViewMode>(initialView);
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<ClientType[]>([]);
  const orderRef = useRef<ClientRecord[]>([]);
  const savedOrder = useRef<ClientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ClientRecord | null>(null);
  // Janela de edição: "new" para criar, um cliente para editar, null fechado.
  const [editing, setEditing] = useState<ClientRecord | "new" | null>(null);
  // Conteúdo mantido durante a animação de saída (ver useLastDefined).
  const shownEditing = useLastDefined(editing);
  const shownPending = useLastDefined(pendingDelete);

  const load = async () => {
    try {
      const list = await listClients();
      orderRef.current = list;
      savedOrder.current = list;
      setClients(list);
      setError(null);
    } catch (err) {
      setError(
        err instanceof ClientError ? err.message : "Não foi possível carregar.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /** Troca na hora e grava a preferência do usuário; volta ao anterior se falhar. */
  const changeView = async (next: ViewMode) => {
    if (next === view) return;
    const previous = view;
    setView(next);
    try {
      await setUserPreference("clients.view", next);
    } catch (err) {
      setView(previous);
      notify.error(
        "Não foi possível salvar a visualização",
        err instanceof Error ? err.message : undefined,
      );
    }
  };

  /** Mostra/oculta na home: troca na hora e desfaz se a gravação falhar. */
  const toggleHome = async (item: ClientRecord) => {
    const next = !item.show_on_home;
    const patch = (value: boolean) =>
      setClients((list) =>
        list.map((c) => (c.id === item.id ? { ...c, show_on_home: value } : c)),
      );
    patch(next);
    try {
      await setClientShowOnHome(item.id, next);
      notify.success(
        next ? `${item.name} aparece na home` : `${item.name} oculto na home`,
      );
    } catch (err) {
      patch(!next);
      const message =
        err instanceof ClientError
          ? err.message
          : "Não foi possível atualizar.";
      setError(message);
      notify.error("Não foi possível atualizar o cliente", message);
    }
  };

  const removeFromList = (id: string) => {
    const without = (list: ClientRecord[]) => list.filter((c) => c.id !== id);
    orderRef.current = without(orderRef.current);
    savedOrder.current = without(savedOrder.current);
    setClients(without);
  };

  /** Grava a ordem ao soltar, sem aviso; volta ao que estava salvo se falhar. */
  const persistOrder = async () => {
    const next = orderRef.current;
    const previous = savedOrder.current;
    const changed = next.some((c, i) => c.id !== previous[i]?.id);
    if (!changed) return;

    // Marca como salvo já: soltar dispara este handler mais de uma vez.
    savedOrder.current = next;
    try {
      await reorderClients(next.map((c) => c.id));
    } catch (err) {
      savedOrder.current = previous;
      orderRef.current = previous;
      setClients(previous);
      const message =
        err instanceof ClientError
          ? err.message
          : "Não foi possível salvar a ordem.";
      setError(message);
      notify.error("Não foi possível salvar a ordem", message);
    }
  };

  const handleDelete = async () => {
    const item = pendingDelete;
    if (!item) return;

    setIsDeleting(true);
    try {
      await deleteClientRecord(item.id);
      removeFromList(item.id);
      notify.success("Cliente excluído");
    } catch (err) {
      const message =
        err instanceof ClientError ? err.message : "Não foi possível excluir.";
      setError(message);
      notify.error("Não foi possível excluir o cliente", message);
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  const normalize = (v: string) =>
    v
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtering = query.trim() !== "" || types.length > 0;
  const visible = clients.filter(
    (c) =>
      (types.length === 0 || types.includes(c.type)) &&
      normalize(c.name).includes(normalize(query.trim())),
  );

  if (isLoading) return <ClientsListSkeleton view={view} />;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        destructive
        isPending={isDeleting}
        title="Excluir cliente"
        description={
          <>
            O cliente <strong>{shownPending?.name}</strong> será removido. Não
            há como desfazer.
          </>
        }
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />

      <Modal
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <ModalContent aria-describedby={undefined}>
          {shownEditing !== null && (
            <ClientForm
              key={shownEditing === "new" ? "new" : shownEditing.id}
              record={shownEditing === "new" ? undefined : shownEditing}
              onSaved={() => {
                setEditing(null);
                load();
              }}
              onDeleted={(client) => {
                setEditing(null);
                removeFromList(client.id);
              }}
            />
          )}
        </ModalContent>
      </Modal>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {clients.length === 0
              ? "Nenhum cliente cadastrado ainda."
              : filtering
                ? `${visible.length} de ${clients.length} clientes`
                : `${clients.length} ${clients.length === 1 ? "cliente" : "clientes"}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {clients.length > 0 && (
            <ClientsToolbar
              query={query}
              onQueryChange={setQuery}
              types={types}
              onTypesChange={setTypes}
            />
          )}
          <ViewSwitcher value={view} onChange={changeView} />
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-transparent bg-primary px-5 text-sm font-bold uppercase text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Cliente
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

      {clients.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Cadastre personalidades, artistas e marcas para alimentar a seção de
            clientes do site.
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhum cliente encontrado com esses critérios.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTypes([]);
            }}
            className="mt-3 text-sm font-bold underline-offset-2 hover:underline"
          >
            Limpar busca e filtro
          </button>
        </div>
      ) : view !== "list" ? (
        <ul
          className={cn(
            "grid grid-cols-1 gap-3 md:grid-cols-2",
            view === "grid-3" && "lg:grid-cols-3",
          )}
        >
          {visible.map((item) => (
            <ClientRow
              key={item.id}
              item={item}
              variant="card"
              reorderable={false}
              onEdit={() => setEditing(item)}
              onDelete={() => setPendingDelete(item)}
              onToggleHome={() => toggleHome(item)}
              onDragEnd={persistOrder}
            />
          ))}
        </ul>
      ) : filtering ? (
        <ul className="space-y-2">
          {visible.map((item) => (
            <ClientRow
              key={item.id}
              item={item}
              reorderable={false}
              onEdit={() => setEditing(item)}
              onDelete={() => setPendingDelete(item)}
              onToggleHome={() => toggleHome(item)}
              onDragEnd={persistOrder}
            />
          ))}
        </ul>
      ) : (
        <Reorder.Group
          as="ul"
          axis="y"
          values={clients}
          onReorder={(next) => {
            orderRef.current = next;
            setClients(next);
          }}
          className="space-y-2"
        >
          {clients.map((item) => (
            <ClientRow
              key={item.id}
              item={item}
              reorderable
              onEdit={() => setEditing(item)}
              onDelete={() => setPendingDelete(item)}
              onToggleHome={() => toggleHome(item)}
              onDragEnd={persistOrder}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};
