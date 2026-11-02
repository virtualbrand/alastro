import { cn } from "@/lib/utils";

/**
 * Bloco de carregamento. Cor derivada do texto (`foreground/10`) para aparecer
 * tanto sobre o fundo areia quanto sobre os cartões, nos dois temas. Quem usa
 * deve dar a ele o tamanho exato do elemento que vai ocupar o lugar.
 */
export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    aria-hidden
    className={cn(
      "animate-pulse rounded bg-foreground/10 motion-reduce:animate-none",
      className,
    )}
    {...props}
  />
);

/**
 * Linha de texto: o contêiner tem a altura da linha real (`lineHeight`, ex.
 * "h-6" para text-base e "h-4" para text-xs) e a barra fica um pouco menor,
 * centralizada. Assim a linha ocupa o mesmo espaço vertical do texto.
 */
export const SkeletonLine = ({
  lineHeight,
  className,
}: {
  lineHeight: string;
  className: string;
}) => (
  <div className={cn("flex items-center", lineHeight)}>
    <Skeleton className={className} />
  </div>
);
