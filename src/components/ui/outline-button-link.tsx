import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Botão-link outline: borda e texto em grafite, preenche de grafite no hover e uma faixa
 * de brilho atravessa o botão. Usado em "Ver todos os serviços", "Ver todos os cases" etc.
 */
export function OutlineButtonLink({
  href,
  children,
  external = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  /** Abre em nova aba (links para fora do site). */
  external?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group/button relative inline-flex items-center justify-center overflow-hidden rounded-md border-2 border-[var(--color-bg)] px-6 py-3 text-[var(--color-bg)] uppercase font-amplitude font-bold transition-all duration-300 ease-in-out hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)] hover:shadow-lg",
        className
      )}
    >
      <span className="text-sm">{children}</span>
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
        <div className="relative h-full w-8 bg-white/20" />
      </div>
    </Link>
  );
}
