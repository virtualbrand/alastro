"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  ProposalError,
  deleteProposal,
  duplicateProposal,
  listProposals,
  setProposalStatus,
} from "@/services/proposalsService";
import {
  PROPOSAL_STATUS_LABEL,
  expiresAt,
  formatPrice,
  isExpired,
  type ProposalRecord,
  type ProposalStatus,
} from "@/types/proposal";
import { ProposalForm } from "@/components/dashboard/ProposalForm";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dropdown } from "@/components/dashboard/Dropdown";
import { cn } from "@/lib/utils";
import { useNotify } from "@/components/ui/notify";
import { Tip } from "@/components/ui/tip";
import { useLastDefined } from "@/hooks/use-last-defined";
import { ProposalsListSkeleton } from "@/components/dashboard/ListSkeletons";

const STATUS_STYLE: Record<ProposalStatus, string> = {
  rascunho: "bg-muted text-muted-foreground",
  enviada: "bg-blue-500/15 text-blue-500",
  aceita: "bg-primary/15 text-[hsl(var(--primary-ink))]",
  recusada: "bg-destructive/15 text-destructive",
};

const formatDateTime = (value: Date): string =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);

export const ProposalsList = () => {
  const notify = useNotify();
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Proposta aguardando confirmação de exclusão.
  const [pendingDelete, setPendingDelete] = useState<ProposalRecord | null>(
    null,
  );
  // Painel de edição: "new" para criar, uma proposta para editar, null fechado.
  const [editing, setEditing] = useState<ProposalRecord | "new" | null>(null);
  // Conteúdo mantido durante a animação de saída (ver useLastDefined).
  const shownPending = useLastDefined(pendingDelete);
  const shownEditing = useLastDefined(editing);

  const load = async () => {
    try {
      setProposals(await listProposals());
      setError(null);
    } catch (err) {
      setError(
        err instanceof ProposalError
          ? err.message
          : "Não foi possível carregar.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (
    proposal: ProposalRecord,
    status: ProposalStatus,
  ) => {
    const previous = proposals;
    setBusyId(proposal.id);
    setProposals((list) =>
      list.map((item) =>
        item.id === proposal.id ? { ...item, status } : item,
      ),
    );
    try {
      await setProposalStatus(proposal.id, status);
      // sent_at é carimbado por trigger: recarrega para refletir a validade.
      await load();
      notify.success(`Status alterado para ${PROPOSAL_STATUS_LABEL[status]}`);
    } catch (err) {
      setProposals(previous);
      const message =
        err instanceof ProposalError
          ? err.message
          : "Não foi possível atualizar.";
      setError(message);
      notify.error("Não foi possível atualizar a proposta", message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDuplicate = async (proposal: ProposalRecord) => {
    setBusyId(proposal.id);
    try {
      const copy = await duplicateProposal(proposal);
      setProposals((list) => [copy, ...list]);
      notify.success("Proposta duplicada");
    } catch (err) {
      const message =
        err instanceof ProposalError
          ? err.message
          : "Não foi possível duplicar.";
      setError(message);
      notify.error("Não foi possível duplicar a proposta", message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    const proposal = pendingDelete;
    if (!proposal) return;

    setBusyId(proposal.id);
    try {
      await deleteProposal(proposal.id);
      setProposals((list) => list.filter((p) => p.id !== proposal.id));
      notify.success("Proposta excluída");
    } catch (err) {
      const message =
        err instanceof ProposalError
          ? err.message
          : "Não foi possível excluir.";
      setError(message);
      notify.error("Não foi possível excluir a proposta", message);
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  };

  if (isLoading) return <ProposalsListSkeleton />;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        destructive
        isPending={busyId === pendingDelete?.id}
        title="Excluir proposta"
        description={
          <>
            A proposta de <strong>{shownPending?.client_name}</strong> será
            removida junto com todas as opções de investimento. Se a página
            pública estiver ativa, o link deixa de funcionar. Não há como
            desfazer.
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
            <ProposalForm
              key={shownEditing === "new" ? "new" : shownEditing.id}
              record={shownEditing === "new" ? undefined : shownEditing}
              onSaved={() => {
                setEditing(null);
                load();
              }}
              onDeleted={(record) => {
                setEditing(null);
                setProposals((list) => list.filter((p) => p.id !== record.id));
              }}
            />
          )}
        </DrawerContent>
      </Drawer>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Propostas</h1>
          <p className="text-sm text-muted-foreground">
            {proposals.length === 0
              ? "Nenhuma proposta criada ainda."
              : `${proposals.length} ${
                  proposals.length === 1 ? "proposta" : "propostas"
                }`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold uppercase text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Proposta
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

      {proposals.length === 0 ? (
        <div className="rounded-md border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Monte a primeira proposta para enviar a um cliente.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {proposals.map((proposal) => {
            const expiry = expiresAt(proposal);
            const expired = isExpired(proposal);
            const cheapest = proposal.options.length
              ? Math.min(...proposal.options.map((o) => o.price_cents || 0))
              : null;

            return (
              <li
                key={proposal.id}
                className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-card p-3 text-card-foreground"
              >
                <div className="min-w-[200px] flex-1">
                  <button
                    type="button"
                    onClick={() => setEditing(proposal)}
                    className="block text-left font-bold transition-colors hover:text-[hsl(var(--primary-ink))]"
                  >
                    {proposal.client_name}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    {proposal.title} · /proposta/{proposal.slug}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {proposal.options.length === 0
                      ? "Sem opções de investimento"
                      : `${proposal.options.length} ${
                          proposal.options.length === 1 ? "opção" : "opções"
                        } · a partir de ${formatPrice(cheapest ?? 0)}`}
                  </p>
                </div>

                {expiry && (
                  <div className="text-xs">
                    <span
                      className={cn(
                        expired ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {expired ? "Expirou em " : "Válida até "}
                      {formatDateTime(expiry)}
                    </span>
                  </div>
                )}

                <Dropdown
                  variant="chip"
                  value={proposal.status}
                  disabled={busyId === proposal.id}
                  onChange={(value) =>
                    handleStatus(proposal, value as ProposalStatus)
                  }
                  ariaLabel={`Situação da proposta de ${proposal.client_name}`}
                  className={STATUS_STYLE[proposal.status]}
                  options={(
                    Object.keys(PROPOSAL_STATUS_LABEL) as ProposalStatus[]
                  ).map((status) => ({
                    value: status,
                    label: PROPOSAL_STATUS_LABEL[status],
                  }))}
                />

                <div className="flex items-center gap-1">
                  {proposal.published && (
                    <Tip label={"Abrir página pública"}>
                      <a
                        href={`/proposta/${proposal.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Tip>
                  )}
                  <Tip label={"Duplicar como rascunho"}>
                    <button
                      type="button"
                      disabled={busyId === proposal.id}
                      onClick={() => handleDuplicate(proposal)}
                      className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </Tip>
                  <Tip label={"Editar"}>
                    <button
                      type="button"
                      onClick={() => setEditing(proposal)}
                      className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </Tip>
                  <Tip label={"Excluir"}>
                    <button
                      type="button"
                      disabled={busyId === proposal.id}
                      onClick={() => setPendingDelete(proposal)}
                      className="flex h-9 w-9 items-center justify-center rounded text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Tip>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
