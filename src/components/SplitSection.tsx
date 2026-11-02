import { cn } from "@/lib/utils";

/**
 * Faixa 50/50: texto de um lado e mídia (vídeo ou foto) do outro. `reversed` inverte os lados;
 * quem monta a página alterna a cada faixa. No mobile o texto vem primeiro e a mídia fica abaixo.
 */
export function SplitSection({
  heading,
  paragraphs,
  media,
  reversed = false,
  label,
  fadeIn = false,
}: {
  heading?: string;
  paragraphs: string[];
  /** Conteúdo do lado da mídia: já preenche o painel (`absolute inset-0`). */
  media: React.ReactNode;
  reversed?: boolean;
  /** Nome acessível da faixa quando ela não tem título. */
  label?: string;
  /** Liga o `.fade-in` ao rolar (precisa de `useScrollAnimation` na página, ex.: via Footer). */
  fadeIn?: boolean;
}) {
  const fade = fadeIn ? "fade-in" : undefined;

  return (
    <section
      aria-label={heading ?? label}
      className={cn(
        "flex flex-col md:min-h-[520px] lg:min-h-[600px]",
        reversed ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      <div
        className={cn(
          "flex w-full items-center px-6 py-14 font-amplitude md:w-1/2 md:py-20",
          // O recuo grande fica na borda externa da tela, alinhado ao header e ao rodapé.
          reversed
            ? "md:pl-12 md:pr-12 lg:pl-16 lg:pr-20 xl:pr-24"
            : "md:pl-12 md:pr-12 lg:pl-20 lg:pr-16 xl:pl-24"
        )}
      >
        <div className="w-full max-w-2xl space-y-5">
          {heading && (
            <h2 className={cn("text-2xl font-bold text-foreground md:text-3xl", fade)}>{heading}</h2>
          )}
          <div className="space-y-4 text-paragraph text-foreground opacity-80">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className={fade}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/*
        Painel da mídia. Em faixas altas (texto longo), a mídia acompanha a rolagem em vez de
        ser esticada e cortada: o miolo é "sticky" com a altura da tela. overflow-clip, e não
        hidden, porque hidden criaria um contêiner de rolagem e desligaria o sticky.
      */}
      <div
        className={cn(
          "relative aspect-video w-full overflow-clip bg-[var(--color-bg)] md:aspect-auto md:w-1/2",
          fade
        )}
      >
        <div className="absolute inset-0 md:sticky md:inset-auto md:top-16 md:h-[calc(100vh-4rem)] md:max-h-full">
          {media}
        </div>
      </div>
    </section>
  );
}
