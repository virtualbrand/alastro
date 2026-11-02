import Link from "next/link";

/** Faixa escura de chamada para contato, de largura total, usada no fim das páginas internas. */
export function CtaBand({
  fadeIn = false,
  title = "Vamos conversar sobre o seu projeto?",
  description,
}: {
  fadeIn?: boolean;
  title?: string;
  /** Texto sob o título; sem ele, usa o padrão com o link para os cases. */
  description?: string;
}) {
  const fade = fadeIn ? "fade-in " : "";

  return (
    <section
      aria-labelledby="cta-title"
      className="w-full bg-[var(--color-bg)] px-4 py-24 font-amplitude md:py-36"
    >
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <h2 id="cta-title" className={`${fade}text-3xl font-bold text-[var(--color-heading)] lg:text-4xl`}>
          {title}
        </h2>
        <p className={`${fade}text-[var(--color-text-primary)] text-paragraph`}>
          {description ?? (
            <>
              Conte para a gente o que você quer construir. Veja também os{" "}
              <Link
                href="/cases"
                className="underline underline-offset-4 transition-colors hover:text-[var(--color-accent-green)]"
              >
                cases que já produzimos
              </Link>
              .
            </>
          )}
        </p>
        {/* Mesmo botão do formulário de contato da home: cantos arredondados, sombra no hover e brilho que atravessa. */}
        <Link
          href="/#contato"
          className={`${fade}group/button relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-[var(--color-accent-green)] px-6 py-3 text-sm font-bold uppercase text-[var(--color-text-secondary)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-accent-green)]/25`}
        >
          <span className="px-2 py-1 text-sm">Falar com a Alastro</span>
          <div
            aria-hidden="true"
            className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
          >
            <div className="relative h-full w-8 bg-white/20" />
          </div>
        </Link>
      </div>
    </section>
  );
}
