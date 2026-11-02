"use client";

import { useState } from "react";
import { AlertCircle, Check, Loader2, Trash2 } from "lucide-react";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { RadioCardGroup } from "@/components/ui/radio-card-group";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  ClientError,
  createClientRecord,
  deleteClientRecord,
  updateClientRecord,
} from "@/services/clientsService";
import { CLIENT_TYPES } from "@/types/client";
import type { ClientInput, ClientRecord } from "@/types/client";
import { cn } from "@/lib/utils";
import { useNotify } from "@/components/ui/notify";

const inputClass =
  "h-11 w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]";

interface ClientFormProps {
  record?: ClientRecord;
  /** Chamado depois de salvar, para a lista recarregar e fechar a janela. */
  /** Nome já preenchido ao criar (ex.: o termo buscado no seletor de clientes). */
  initialName?: string;
  onSaved: (client: ClientRecord) => void;
  /** Chamado depois de excluir (só na edição), para a lista remover o item. */
  onDeleted?: (client: ClientRecord) => void;
}

/** Formulário de cliente; deve ser renderizado dentro de um ModalContent. */
export const ClientForm = ({
  record,
  initialName,
  onSaved,
  onDeleted,
}: ClientFormProps) => {
  const isEditing = Boolean(record);
  const notify = useNotify();

  const [form, setForm] = useState<ClientInput>({
    name: record?.name ?? initialName ?? "",
    type: record?.type ?? "marca",
    photo_url: record?.photo_url ?? null,
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!record) return;
    setIsDeleting(true);
    try {
      await deleteClientRecord(record.id);
      notify.success("Cliente excluído");
      onDeleted?.(record);
    } catch (err) {
      setConfirmingDelete(false);
      const message =
        err instanceof ClientError
          ? err.message
          : "Não foi possível excluir agora. Tente novamente.";
      setError(message);
      notify.error("Não foi possível excluir o cliente", message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Em portal, o submit subiria pela árvore React até um formulário pai (ex.: o do case).
    e.stopPropagation();
    const name = form.name.trim();
    if (!name) {
      setNameError("Informe o nome.");
      return;
    }
    setNameError(null);
    setIsSaving(true);
    setError(null);

    try {
      const payload = { ...form, name };
      const saved = record
        ? await updateClientRecord(record.id, payload)
        : await createClientRecord(payload);
      notify.success("Cliente salvo");
      onSaved(saved);
    } catch (err) {
      const message =
        err instanceof ClientError
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
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold">
            {isEditing ? "Editar cliente" : "Novo cliente"}
          </DrawerTitle>
          <p className="text-xs text-muted-foreground">
            {form.name.trim() || "Sem nome"}
          </p>
        </DrawerHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <label className="block space-y-1.5">
            <span className="block text-xs font-bold uppercase tracking-wide">
              Nome
            </span>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome do cliente"
              autoFocus
            />
            {nameError && (
              <span className="block text-xs text-destructive">
                {nameError}
              </span>
            )}
          </label>

          <RadioCardGroup
            label="Tipo de cliente"
            options={CLIENT_TYPES}
            value={form.type}
            onChange={(type) => setForm({ ...form, type })}
          />

          <div className="space-y-1.5">
            <span className="block text-xs font-bold uppercase tracking-wide">
              Foto
            </span>
            <div className="flex items-start gap-4">
              <div className="w-[140px] shrink-0">
                <ImageUpload
                  label="Foto"
                  folder="clients"
                  value={form.photo_url}
                  onChange={(url) => setForm({ ...form, photo_url: url })}
                  square
                  compact
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Tamanho ideal: 140 × 140 px (quadrada, 1:1). JPG, PNG, WebP ou
                AVIF até 8 MB. Use a foto da personalidade ou do artista, ou o
                logo da marca.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          {record ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-md border border-destructive px-6 py-3 text-sm font-bold uppercase text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </button>
          ) : null}
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
      </form>

      {record && (
        <ConfirmDialog
          open={confirmingDelete}
          onOpenChange={setConfirmingDelete}
          destructive
          isPending={isDeleting}
          title="Excluir cliente"
          description={
            <>
              O cliente <strong>{record.name}</strong> será removido e
              desvinculado dos cases. Não há como desfazer.
            </>
          }
          confirmLabel="Excluir"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
