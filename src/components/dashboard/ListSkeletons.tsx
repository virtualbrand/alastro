import { Skeleton, SkeletonLine } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/view-mode";

/*
 * Esqueletos das listagens do painel. Cada um repete a estrutura e as medidas
 * da linha ou cartão real (mesmas classes de contêiner, fotos e botões nos
 * mesmos tamanhos), para a tela não "pular" quando os dados chegam. Se mudar o
 * layout de uma listagem, ajuste o esqueleto dela junto.
 */

const ROWS = 6;

const ROW_CLASS =
  "flex flex-wrap items-center gap-4 rounded-md border border-border bg-card p-3 text-card-foreground";
const CARD_CLASS =
  "flex items-center gap-4 rounded-md border border-border bg-card p-3 text-card-foreground";

/** Botão de ícone da linha: 36x36 com o ícone de 16px dentro. */
const IconButton = () => (
  <span className="flex h-9 w-9 items-center justify-center">
    <Skeleton className="h-4 w-4" />
  </span>
);

/** Alça de reordenar: 24x36, ícone de 20px. */
const Grip = () => (
  <span className="-mr-2 flex h-9 w-6 shrink-0 items-center justify-center">
    <Skeleton className="h-5 w-4" />
  </span>
);

const Pill = ({ className }: { className: string }) => (
  <Skeleton className={cn("rounded-full", className)} />
);

const Switch = () => <Skeleton className="h-6 w-11 shrink-0 rounded-full" />;

/** Cabeçalho da página: título real (é texto fixo), contagem e ações em esqueleto. */
const PageHeader = ({
  title,
  actions,
}: {
  title: string;
  actions: React.ReactNode;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <SkeletonLine lineHeight="h-5" className="h-3.5 w-24" />
    </div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

const ToolButton = () => <Skeleton className="h-11 w-11 shrink-0 rounded-md" />;
const CtaButton = ({ width }: { width: string }) => (
  <Skeleton className={cn("h-11 shrink-0 rounded-md", width)} />
);

const Wrapper = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-6" role="status" aria-busy="true">
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

const gridClass = (view: ViewMode) =>
  cn(
    "grid grid-cols-1 gap-3 md:grid-cols-2",
    view === "grid-3" && "lg:grid-cols-3",
  );

// ---------------------------------------------------------------------------
// Clientes
// ---------------------------------------------------------------------------

export const ClientsListSkeleton = ({ view = "list" }: { view?: ViewMode }) => (
  <Wrapper label="Carregando clientes">
    <PageHeader
      title="Clientes"
      actions={
        <>
          <ToolButton />
          <ToolButton />
          <ToolButton />
          <CtaButton width="w-[116px]" />
        </>
      }
    />
    <ul className={view === "list" ? "space-y-2" : gridClass(view)}>
      {Array.from({ length: ROWS }).map((_, i) =>
        view === "list" ? (
          <li key={i} className={ROW_CLASS}>
            <Grip />
            <Skeleton className="h-14 w-14 shrink-0" />
            <div className="flex min-w-[180px] flex-1 items-center gap-3">
              <SkeletonLine lineHeight="h-6" className="h-4 w-40" />
              <Pill className="h-[22px] w-20" />
            </div>
            <Switch />
            <div className="flex items-center gap-1">
              <IconButton />
              <IconButton />
            </div>
          </li>
        ) : (
          <li key={i} className={CARD_CLASS}>
            <Skeleton className="h-16 w-16 shrink-0" />
            <div className="min-w-0 flex-1">
              <SkeletonLine lineHeight="h-6" className="h-4 w-36" />
              <Pill className="mt-1 h-[22px] w-20" />
            </div>
            <Switch />
            <div className="flex items-center gap-1">
              <IconButton />
              <IconButton />
            </div>
          </li>
        ),
      )}
    </ul>
  </Wrapper>
);

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

export const CasesListSkeleton = ({ view = "list" }: { view?: ViewMode }) => (
  <Wrapper label="Carregando cases">
    <PageHeader
      title="Cases"
      actions={
        <>
          <ToolButton />
          <ToolButton />
          <ToolButton />
          <ToolButton />
          <CtaButton width="w-24" />
        </>
      }
    />
    <ul className={view === "list" ? "space-y-2" : gridClass(view)}>
      {Array.from({ length: ROWS }).map((_, i) =>
        view === "list" ? (
          <li key={i} className={ROW_CLASS}>
            <Grip />
            <Skeleton className="h-14 w-20 shrink-0" />
            <div className="min-w-[180px] flex-1">
              <SkeletonLine lineHeight="h-6" className="h-4 w-56" />
              <SkeletonLine lineHeight="h-6" className="h-3 w-72" />
            </div>
            <IconButton />
            <Pill className="h-6 w-24" />
            <div className="flex items-center gap-1">
              <IconButton />
              <IconButton />
              <IconButton />
            </div>
          </li>
        ) : (
          <li
            key={i}
            className="flex flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground"
          >
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="flex-1 space-y-1 p-4">
              <SkeletonLine lineHeight="h-6" className="h-4 w-3/4" />
              <SkeletonLine lineHeight="h-6" className="h-3 w-1/2" />
            </div>
            <div className="flex items-center gap-1 border-t border-border px-3 py-2">
              <IconButton />
              <Pill className="h-6 w-24" />
              <div className="ml-auto flex items-center gap-1">
                <IconButton />
                <IconButton />
                <IconButton />
              </div>
            </div>
          </li>
        ),
      )}
    </ul>
  </Wrapper>
);

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export const PostsListSkeleton = () => (
  <Wrapper label="Carregando artigos">
    <PageHeader title="Blog" actions={<CtaButton width="w-[120px]" />} />
    <ul className="space-y-2">
      {Array.from({ length: ROWS }).map((_, i) => (
        <li key={i} className={ROW_CLASS}>
          <Skeleton className="h-14 w-20 shrink-0" />
          <div className="min-w-[200px] flex-1">
            <SkeletonLine lineHeight="h-6" className="h-4 w-64" />
            <SkeletonLine lineHeight="h-4" className="h-3 w-48" />
            <div className="mt-1 flex gap-1">
              <Pill className="h-[19px] w-14" />
              <Pill className="h-[19px] w-16" />
            </div>
          </div>
          <Pill className="h-6 w-24" />
          <div className="flex items-center gap-1">
            <IconButton />
            <IconButton />
            <IconButton />
          </div>
        </li>
      ))}
    </ul>
  </Wrapper>
);

// ---------------------------------------------------------------------------
// Propostas
// ---------------------------------------------------------------------------

export const ProposalsListSkeleton = () => (
  <Wrapper label="Carregando propostas">
    <PageHeader title="Propostas" actions={<CtaButton width="w-[148px]" />} />
    <ul className="space-y-2">
      {Array.from({ length: ROWS }).map((_, i) => (
        <li key={i} className={ROW_CLASS}>
          <div className="min-w-[200px] flex-1">
            <SkeletonLine lineHeight="h-6" className="h-4 w-48" />
            <SkeletonLine lineHeight="h-4" className="h-3 w-72" />
            <div className="mt-1">
              <SkeletonLine lineHeight="h-4" className="h-3 w-56" />
            </div>
          </div>
          <SkeletonLine lineHeight="h-4" className="h-3 w-40" />
          <Pill className="h-7 w-28" />
          <div className="flex items-center gap-1">
            <IconButton />
            <IconButton />
            <IconButton />
            <IconButton />
          </div>
        </li>
      ))}
    </ul>
  </Wrapper>
);
