"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  CircleDollarSign,
  FileText,
  Info,
  ListChecks,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/dashboard/Dropdown";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { RepeaterItem } from "@/components/dashboard/RepeaterItem";
import { ListEditor } from "@/components/dashboard/ListEditor";
import {
  ProposalError,
  createProposal,
  deleteProposal,
  updateProposal,
} from "@/services/proposalsService";
import { slugify } from "@/lib/slug";
import {
  PROPOSAL_STATUS_LABEL,
  emptyDeliverable,
  emptyOption,
  emptySection,
  formatPrice,
  parsePrice,
  type Deliverable,
  type ProposalInput,
  type ProposalOption,
  type ProposalRecord,
  type ProposalSection,
  type ProposalStatus,
} from "@/types/proposal";
import { useNotify } from "@/components/ui/notify";

const inputClass =
  "h-11 w-full rounded-md border border-border bg-[hsl(var(--field))] px-3 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]";

const textareaClass =
  "min-h-[90px] w-full resize-y rounded-md border border-border bg-[hsl(var(--field))] px-3 py-2 text-sm outline-none transition-colors focus:border-[hsl(var(--primary-ink))]";

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

const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="space-y-1 border-b border-border pb-3">
    <h2 className="text-lg font-bold">{title}</h2>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);

const emptyProposal: ProposalInput = {
  slug: "",
  title: "",
  client_name: "",
  client_contact: "",
  cover_url: null,
  project: "",
  approach: "",
  deliverables: [],
  options: [],
  exclusions: [],
  sections: [],
  validity_hours: 48,
  status: "rascunho",
  published: false,
};

/** Move um item de lista preservando o resto da ordem. */
const move = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const TABS = [
  { id: "info", label: "Informações", icon: Info },
  { id: "content", label: "Conteúdo", icon: FileText },
  { id: "scope", label: "Escopo", icon: ListChecks },
  { id: "invest", label: "Investimento", icon: CircleDollarSign },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface ProposalFormProps {
  record?: ProposalRecord;
  /** Chamado depois de salvar, para a lista recarregar e fechar o painel. */
  onSaved: () => void;
  /** Chamado depois de excluir (só na edição), para a lista remover o item. */
  onDeleted?: (record: ProposalRecord) => void;
}

/** Formulário de proposta; deve ser renderizado dentro de um DrawerContent. */
export const ProposalForm = ({
  record,
  onSaved,
  onDeleted,
}: ProposalFormProps) => {
  const notify = useNotify();
  const isEditing = Boolean(record);

  const [form, setForm] = useState<ProposalInput>(
    record
      ? {
          slug: record.slug,
          title: record.title,
          client_name: record.client_name,
          client_contact: record.client_contact ?? "",
          cover_url: record.cover_url,
          project: record.project ?? "",
          approach: record.approach ?? "",
          deliverables: record.deliverables ?? [],
          options: record.options ?? [],
          exclusions: record.exclusions ?? [],
          sections: record.sections ?? [],
          validity_hours: record.validity_hours,
          status: record.status,
          published: record.published,
        }
      : emptyProposal,
  );

  const [slugLocked, setSlugLocked] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("info");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const set = <K extends keyof ProposalInput>(
    key: K,
    value: ProposalInput[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  // O slug acompanha o nome do cliente até ser editado à mão — a URL
  // pública é /proposta/<cliente>.
  const handleClientName = (client_name: string) => {
    setForm((current) => ({
      ...current,
      client_name,
      slug: slugLocked ? current.slug : slugify(client_name),
    }));
  };

  const patchDeliverable = (index: number, patch: Partial<Deliverable>) =>
    set(
      "deliverables",
      form.deliverables.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    );

  const patchOption = (index: number, patch: Partial<ProposalOption>) =>
    set(
      "options",
      form.options.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    );

  const patchSection = (index: number, patch: Partial<ProposalSection>) =>
    set(
      "sections",
      form.sections.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    );

  // Campos obrigatórios, calculados a cada render: o Salvar só habilita quando estão ok.
  const missing: string[] = [];
  if (!form.client_name.trim()) missing.push("Cliente");
  if (!form.title.trim()) missing.push("Título");
  if (!form.slug.replace(/-+$/, "")) missing.push("URL");
  if (form.validity_hours < 1) missing.push("Validade (mínimo 1 hora)");
  const canSave = missing.length === 0 && !isSaving;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) {
      setTab("info");
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload: ProposalInput = {
      ...form,
      slug: form.slug.replace(/-+$/, ""),
      client_contact: form.client_contact?.trim() || null,
    };

    try {
      if (record) await updateProposal(record.id, payload);
      else await createProposal(payload);
      notify.success("Proposta salva");
      onSaved();
    } catch (err) {
      const message =
        err instanceof ProposalError
          ? err.message
          : "Não foi possível salvar agora. Tente novamente.";
      setError(message);
      notify.error("Não foi possível salvar", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!record) return;
    setIsDeleting(true);
    try {
      await deleteProposal(record.id);
      notify.success("Proposta excluída");
      onDeleted?.(record);
    } catch (err) {
      setConfirmingDelete(false);
      const message =
        err instanceof ProposalError
          ? err.message
          : "Não foi possível excluir agora. Tente novamente.";
      setError(message);
      notify.error("Não foi possível excluir a proposta", message);
    } finally {
      setIsDeleting(false);
    }
  };

  const total = form.options.reduce(
    (sum, option) => sum + (option.price_cents || 0),
    0,
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <DrawerHeader
          actions={
            <label className="flex items-center gap-2">
              <span className="text-sm font-bold">
                {form.published ? "Página ativa" : "Página oculta"}
              </span>
              <Switch
                checked={form.published}
                onCheckedChange={(v) => set("published", v)}
              />
            </label>
          }
        >
          <DrawerTitle className="text-xl font-bold">
            {isEditing ? "Editar proposta" : "Nova proposta"}
          </DrawerTitle>
          <p className="text-xs text-muted-foreground">
            {form.client_name.trim() || "Sem cliente"}
          </p>
        </DrawerHeader>

        <div
          role="tablist"
          aria-label="Seções da proposta"
          className="flex flex-wrap items-center gap-1 border-b border-border px-6 py-2"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`proposal-tab-${id}-trigger`}
                aria-selected={active}
                aria-controls={`proposal-tab-${id}`}
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
            id="proposal-tab-info"
            aria-labelledby="proposal-tab-info-trigger"
            hidden={tab !== "info"}
            className="space-y-8"
          >
            <Field label="Cliente">
              <input
                className={inputClass}
                value={form.client_name}
                onChange={(e) => handleClientName(e.target.value)}
                placeholder="Grupo Zit"
              />
            </Field>

            <Field
              label="Título da proposta"
              hint="Ex.: Documentário institucional, Gestão de conteúdo."
            >
              <input
                className={inputClass}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Proposta Comercial"
              />
            </Field>

            <Field
              label="URL"
              hint={
                <span className="flex items-center gap-1">
                  <span className="truncate">
                    {SITE_URL}/proposta/{form.slug || "..."}
                  </span>
                  {form.slug && (
                    <CopyLinkButton
                      value={`${SITE_URL}/proposta/${form.slug}`}
                    />
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
                placeholder="grupo-zit"
              />
            </Field>

            <Field
              label="Contato"
              hint="Nome e e-mail de quem recebe. Não aparece na página pública."
            >
              <input
                className={inputClass}
                value={form.client_contact ?? ""}
                onChange={(e) => set("client_contact", e.target.value)}
                placeholder="Maria Silva — maria@grupozit.com.br"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Situação">
                <Dropdown
                  value={form.status}
                  onChange={(value) => set("status", value as ProposalStatus)}
                  options={(
                    Object.keys(PROPOSAL_STATUS_LABEL) as ProposalStatus[]
                  ).map((status) => ({
                    value: status,
                    label: PROPOSAL_STATUS_LABEL[status],
                  }))}
                />
              </Field>
              <Field
                label="Validade (horas)"
                hint="As propostas de referência usam 48 horas."
              >
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={form.validity_hours}
                  onChange={(e) =>
                    set("validity_hours", Number(e.target.value) || 0)
                  }
                />
              </Field>
            </div>
            <p className="-mt-2 text-xs text-muted-foreground">
              Ao sair de rascunho, a data de envio é registrada e a validade
              passa a contar a partir dela.
            </p>

            <ImageUpload
              label="Imagem de capa"
              value={form.cover_url}
              onChange={(url) => set("cover_url", url)}
              folder="propostas"
              hint="Opcional. Usada no topo da proposta."
            />
          </div>

          <div
            role="tabpanel"
            id="proposal-tab-content"
            aria-labelledby="proposal-tab-content-trigger"
            hidden={tab !== "content"}
            className="space-y-8"
          >
            <section className="space-y-5">
              <SectionHeading
                title="Projeto"
                description="O contexto do cliente e o que a Alastro propõe construir."
              />
              <RichTextEditor
                value={form.project ?? ""}
                onChange={(html) => set("project", html)}
                placeholder="Há mais de 55 anos, uma história começou a ser construída..."
                onUploadError={setError}
              />
            </section>
            <section className="space-y-5">
              <SectionHeading
                title="Narrativa"
                description="A abordagem: como a história será contada."
              />
              <RichTextEditor
                value={form.approach ?? ""}
                onChange={(html) => set("approach", html)}
                placeholder="A narrativa será construída a partir de três tempos..."
                onUploadError={setError}
              />
            </section>

            <section className="space-y-4">
              <SectionHeading
                title="Seções finais"
                description="Blocos livres: Informações complementares, Direção, Contrato, Maturação."
              />

              {form.sections.length > 0 && (
                <ul className="space-y-3">
                  {form.sections.map((section, index) => (
                    <RepeaterItem
                      key={index}
                      index={index}
                      total={form.sections.length}
                      label={section.title || `Seção ${index + 1}`}
                      onMove={(from, to) =>
                        set("sections", move(form.sections, from, to))
                      }
                      onRemove={(i) =>
                        set(
                          "sections",
                          form.sections.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <input
                        className={inputClass}
                        value={section.title}
                        onChange={(e) =>
                          patchSection(index, { title: e.target.value })
                        }
                        placeholder="Informações complementares"
                      />
                      <RichTextEditor
                        value={section.content}
                        onChange={(content) => patchSection(index, { content })}
                        placeholder="Todo o projeto será conduzido pelo núcleo principal da Alastro..."
                        onUploadError={setError}
                      />
                    </RepeaterItem>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={() =>
                  set("sections", [...form.sections, emptySection()])
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Adicionar seção
              </button>
            </section>
          </div>

          <div
            role="tabpanel"
            id="proposal-tab-scope"
            aria-labelledby="proposal-tab-scope-trigger"
            hidden={tab !== "scope"}
            className="space-y-8"
          >
            <section className="space-y-4">
              <SectionHeading
                title="Entregáveis"
                description="Blocos por etapa: pré-produção, direção, produção, pós-produção."
              />

              {form.deliverables.length > 0 && (
                <ul className="space-y-3">
                  {form.deliverables.map((item, index) => (
                    <RepeaterItem
                      key={index}
                      index={index}
                      total={form.deliverables.length}
                      label={item.title || `Entregável ${index + 1}`}
                      onMove={(from, to) =>
                        set("deliverables", move(form.deliverables, from, to))
                      }
                      onRemove={(i) =>
                        set(
                          "deliverables",
                          form.deliverables.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <input
                        className={inputClass}
                        value={item.title}
                        onChange={(e) =>
                          patchDeliverable(index, { title: e.target.value })
                        }
                        placeholder="Pré-produção e desenvolvimento"
                      />
                      <textarea
                        className={textareaClass}
                        value={item.description}
                        onChange={(e) =>
                          patchDeliverable(index, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Visita técnica à operação para estudo dos espaços..."
                      />
                    </RepeaterItem>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={() =>
                  set("deliverables", [
                    ...form.deliverables,
                    emptyDeliverable(),
                  ])
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Adicionar entregável
              </button>
            </section>

            <section className="space-y-4">
              <SectionHeading
                title="Não incluso"
                description="O que fica de fora do escopo. Evita ruído depois."
              />
              <ListEditor
                items={form.exclusions}
                onChange={(exclusions) => set("exclusions", exclusions)}
                placeholder="Gestão de WhatsApp, SAC ou atendimento direto"
                emptyLabel="Nenhuma exclusão listada."
              />
            </section>
          </div>

          <div
            role="tabpanel"
            id="proposal-tab-invest"
            aria-labelledby="proposal-tab-invest-trigger"
            hidden={tab !== "invest"}
            className="space-y-8"
          >
            <section className="space-y-4">
              <SectionHeading
                title="Opções de investimento"
                description="Cada opção vira um bloco com descrição, lista do que inclui e valor."
              />

              {form.options.length > 0 && (
                <ul className="space-y-3">
                  {form.options.map((option, index) => (
                    <RepeaterItem
                      key={index}
                      index={index}
                      total={form.options.length}
                      label={option.name || `Opção ${index + 1}`}
                      onMove={(from, to) =>
                        set("options", move(form.options, from, to))
                      }
                      onRemove={(i) =>
                        set(
                          "options",
                          form.options.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          className={inputClass}
                          value={option.name}
                          onChange={(e) =>
                            patchOption(index, { name: e.target.value })
                          }
                          placeholder="Proposta 1"
                        />
                        <input
                          className={inputClass}
                          value={option.subtitle}
                          onChange={(e) =>
                            patchOption(index, { subtitle: e.target.value })
                          }
                          placeholder="Mini Documentário"
                        />
                      </div>

                      <textarea
                        className={textareaClass}
                        value={option.description}
                        onChange={(e) =>
                          patchOption(index, { description: e.target.value })
                        }
                        placeholder="Uma produção documental mais objetiva..."
                      />

                      <div className="space-y-1.5">
                        <span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Inclui
                        </span>
                        <ListEditor
                          items={option.includes}
                          onChange={(includes) =>
                            patchOption(index, { includes })
                          }
                          placeholder="02 diárias de produção audiovisual"
                          emptyLabel="Nenhum item ainda. Um por linha, como na proposta em PDF."
                        />
                      </div>

                      <textarea
                        className={textareaClass}
                        value={option.note}
                        onChange={(e) =>
                          patchOption(index, { note: e.target.value })
                        }
                        placeholder="Parágrafo de fechamento, abaixo da lista."
                      />

                      <div className="space-y-1.5">
                        <span className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Investimento
                        </span>
                        <input
                          inputMode="numeric"
                          className={inputClass}
                          value={
                            option.price_cents
                              ? formatPrice(option.price_cents)
                              : ""
                          }
                          onChange={(e) =>
                            patchOption(index, {
                              price_cents: parsePrice(e.target.value),
                            })
                          }
                          placeholder="R$ 0,00"
                        />
                      </div>
                    </RepeaterItem>
                  ))}
                </ul>
              )}

              <button
                type="button"
                onClick={() =>
                  set("options", [
                    ...form.options,
                    emptyOption(form.options.length + 1),
                  ])
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-[hsl(var(--primary-ink))] hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Adicionar opção
              </button>
            </section>

            {form.options.length > 0 && (
              <div className="rounded-md border border-border bg-[hsl(var(--panel))] p-4 text-card-foreground">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Resumo
                </p>
                <ul className="mt-3 space-y-2">
                  {form.options.map((option, index) => (
                    <li
                      key={index}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {option.name || `Opção ${index + 1}`}
                      </span>
                      <span className="font-bold">
                        {formatPrice(option.price_cents)}
                      </span>
                    </li>
                  ))}
                </ul>
                {form.options.length > 1 && (
                  <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    Soma de todas as opções: {formatPrice(total)} — são
                    alternativas, não um total a cobrar.
                  </p>
                )}
              </div>
            )}
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
          {missing.length > 0 && (
            <p className="mr-auto text-xs text-muted-foreground">
              Para salvar, preencha: {missing.join(", ")}.
            </p>
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

      {record && (
        <ConfirmDialog
          open={confirmingDelete}
          onOpenChange={setConfirmingDelete}
          destructive
          isPending={isDeleting}
          title="Excluir proposta"
          description={
            <>
              A proposta de <strong>{record.client_name}</strong> será removida
              junto com a página pública. Não há como desfazer.
            </>
          }
          confirmLabel="Excluir"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
