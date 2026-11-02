import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, Check, Clock } from "lucide-react";
import { createPublicClient } from "@/lib/supabase/public";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  ALASTRO_ABOUT,
  ALASTRO_CLIENTS,
  ALASTRO_TAGLINE,
} from "@/content/alastro";
import { expiresAt, formatPrice, type ProposalRecord } from "@/types/proposal";

/*
 * Sem cache: é um documento comercial com valores. Um ajuste de preço
 * precisa valer no mesmo instante — página servida sob demanda.
 */
export const revalidate = 0;

/**
 * Proposta não é conteúdo de site: carrega valores e nome de cliente, e o
 * acesso se dá por quem tem o link. Fora do índice dos buscadores.
 */
const NOINDEX: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false },
};

const fetchProposal = async (slug: string): Promise<ProposalRecord | null> => {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("proposals")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as ProposalRecord) ?? null;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const proposal = await fetchProposal(slug);

  return {
    robots: NOINDEX,
    title: proposal
      ? `${proposal.title} — ${proposal.client_name} | Alastro`
      : "Proposta não encontrada | Alastro",
  };
};

const formatDateTime = (value: Date): string =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="border-t border-[var(--color-border-form)] py-16">
    <h2 className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent-green)]">
      {title}
    </h2>
    {children}
  </section>
);

const proseClass =
  "prose prose-invert max-w-4xl prose-headings:text-[var(--color-heading)] prose-p:text-[var(--color-text-primary)] prose-li:text-[var(--color-text-primary)] prose-strong:text-[var(--color-heading)] prose-a:text-[var(--color-accent-green)]";

export default async function PropostaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposal = await fetchProposal(slug);

  if (!proposal) notFound();

  const expiry = expiresAt(proposal);
  const expired = expiry ? expiry.getTime() < Date.now() : false;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-amplitude">
      <main className="mx-auto w-full max-w-[1400px] px-2 pb-24 pt-16 md:px-8">
        {/* Capa */}
        <header className="pb-16">
          <img
            src="/images/logo.svg"
            alt="Alastro"
            className="h-10 w-auto brightness-0 invert"
          />
          <p className="mt-3 text-xs lowercase tracking-wide text-[var(--color-text-primary)] opacity-60">
            {ALASTRO_TAGLINE}
          </p>

          <div className="mt-16 space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-accent-green)]">
              Proposta comercial
            </p>
            <h1 className="text-4xl font-bold text-[var(--color-heading)] lg:text-6xl">
              {proposal.client_name}
            </h1>
            <p className="text-xl text-[var(--color-text-primary)] opacity-80">
              {proposal.title}
            </p>
          </div>

          {proposal.cover_url && (
            <img
              src={proposal.cover_url}
              alt=""
              className="mt-12 w-full rounded-md object-cover"
            />
          )}
        </header>

        {expired && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-md border border-amber-400/40 bg-amber-500/10 px-4 py-3"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <p className="text-sm text-[var(--color-text-primary)]">
              O prazo de validade desta proposta venceu em{" "}
              {expiry && formatDateTime(expiry)}. Valores e condições podem ter
              mudado — fale com a equipe para uma versão atualizada.
            </p>
          </div>
        )}

        {/* Sobre a Alastro */}
        <Section title="Conheça a Alastro">
          <div className="max-w-3xl space-y-4">
            {ALASTRO_ABOUT.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg text-[var(--color-text-primary)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Section>

        {/* Clientes atendidos */}
        <Section title="Clientes atendidos">
          <div className="grid gap-10 sm:grid-cols-3">
            {ALASTRO_CLIENTS.map((group) => (
              <div key={group.label}>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-primary)] opacity-60">
                  {group.label}
                </h3>
                <ul className="space-y-1.5">
                  {group.names.map((name) => (
                    <li
                      key={name}
                      className="text-[var(--color-heading)]"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Projeto */}
        {proposal.project && (
          <Section title="Projeto">
            <div
              className={proseClass}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(proposal.project),
              }}
            />
          </Section>
        )}

        {/* Narrativa */}
        {proposal.approach && (
          <Section title="Narrativa">
            <div
              className={proseClass}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(proposal.approach),
              }}
            />
          </Section>
        )}

        {/* Entregáveis */}
        {proposal.deliverables.length > 0 && (
          <Section title="Entregáveis">
            <ul className="grid gap-8 sm:grid-cols-2">
              {proposal.deliverables.map((item, index) => (
                <li key={index} className="space-y-2">
                  <h3 className="flex items-start gap-2 text-lg font-bold text-[var(--color-heading)]">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-green)]"
                    />
                    {item.title}
                  </h3>
                  <p className="pl-4 text-[var(--color-text-primary)] opacity-80">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Opções de investimento */}
        {proposal.options.length > 0 && (
          <Section title="Propostas">
            <ul className="grid gap-6 lg:grid-cols-2">
              {proposal.options.map((option, index) => (
                <li
                  key={index}
                  className="flex flex-col rounded-md border border-[var(--color-border-form)] bg-[var(--color-surface)] p-8"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-primary)] opacity-60">
                    {option.name}
                  </p>

                  {option.subtitle && (
                    <h3 className="mt-2 text-2xl font-bold text-[var(--color-heading)]">
                      {option.subtitle}
                    </h3>
                  )}

                  {option.description && (
                    <p className="mt-4 text-[var(--color-text-primary)] opacity-80">
                      {option.description}
                    </p>
                  )}

                  {option.includes.length > 0 && (
                    <>
                      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-[var(--color-text-primary)]">
                        Inclui
                      </p>
                      <ul className="mt-3 space-y-2">
                        {option.includes.map((entry, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-[var(--color-text-primary)]"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-green)]" />
                            {entry}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {option.note && (
                    <p className="mt-6 text-sm text-[var(--color-text-primary)] opacity-70">
                      {option.note}
                    </p>
                  )}

                  <p className="mt-auto pt-8 text-right text-xl font-bold text-[var(--color-accent-green)]">
                    Investimento: {formatPrice(option.price_cents)}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Não incluso */}
        {proposal.exclusions.length > 0 && (
          <Section title="Não incluso na proposta">
            <ul className="max-w-3xl space-y-2">
              {proposal.exclusions.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-[var(--color-text-primary)] opacity-80"
                >
                  <span aria-hidden className="mt-2.5 h-px w-3 bg-current" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Seções finais */}
        {proposal.sections.map((section, index) => (
          <Section key={index} title={section.title}>
            <div
              className={proseClass}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(section.content),
              }}
            />
          </Section>
        ))}

        {/* Validade */}
        <Section title="Validade">
          <div className="flex max-w-3xl items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-green)]" />
            <div className="space-y-2 text-[var(--color-text-primary)]">
              <p>
                Esta proposta é válida por {proposal.validity_hours} horas a
                partir do envio. Após esse prazo, valores e condições poderão
                ser revistos de acordo com a disponibilidade da equipe.
              </p>
              {expiry && (
                <p className="text-sm opacity-70">
                  {expired ? "Venceu em " : "Válida até "}
                  {formatDateTime(expiry)}.
                </p>
              )}
            </div>
          </div>
        </Section>

        <footer className="border-t border-[var(--color-border-form)] pt-8">
          <img
            src="/images/logo.svg"
            alt="Alastro"
            className="h-7 w-auto brightness-0 invert"
          />
          <p className="mt-2 text-xs text-[var(--color-text-primary)] opacity-50">
            {ALASTRO_TAGLINE}
          </p>
        </footer>
      </main>
    </div>
  );
}
