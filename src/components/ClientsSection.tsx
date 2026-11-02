"use client"

import { useEffect, useRef } from "react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import type { SiteClient } from "@/lib/clients-queries"
import { OptimizedImage } from "@/components/ui/optimized-image"

/**
 * Velocidade das duas fileiras: quanto tempo cada cartão leva para andar a própria largura.
 * Cada fileira repete a lista 4 vezes e se desloca exatamente uma lista (25% da faixa) por
 * ciclo; a duração é proporcional ao número de itens, então o deslocamento por segundo
 * (px/s) é igual nas duas, mesmo com listas de tamanhos diferentes.
 */
const SECONDS_PER_ITEM = 3.5;

/**
 * Pausa a fileira quando o mouse está sobre ela, com desaceleração suave.
 *
 * animation-play-state: paused para de uma vez. Aqui a velocidade da animação CSS
 * (playbackRate) cai de 1 até 0 e volta, com ease exponencial (constante de tempo de ~200ms),
 * então a fileira freia e retoma sem trancos.
 */
const useSmoothPause = (ref: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const TIME_CONSTANT = 200
    let rate = 1
    let target = 1
    let raf = 0
    let last = 0

    const step = (now: number) => {
      const dt = Math.min(now - last, 64)
      last = now
      rate += (target - rate) * (1 - Math.exp(-dt / TIME_CONSTANT))
      if (Math.abs(target - rate) < 0.01) rate = target
      el.getAnimations().forEach((animation) => {
        animation.playbackRate = rate
      })
      if (rate !== target) raf = requestAnimationFrame(step)
    }

    const go = (next: number) => {
      target = next
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(step)
    }
    const onEnter = () => go(0)
    const onLeave = () => go(1)

    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [ref])
}

/**
 * Deixa o scroll horizontal do mouse (trackpad, shift + roda) mover a fileira.
 *
 * A fileira anda por uma animação CSS que se repete a cada "uma lista" (25% da faixa), então
 * arrastar é só avançar ou recuar o tempo da animação, com módulo para dar a volta. O autoplay
 * não é tocado: ao parar de rolar e tirar o mouse, ele segue de onde a fileira ficou.
 *
 * `direction` é o sentido da animação: -1 para a que corre para a esquerda, 1 para a que corre
 * para a direita. Rolar para a direita (deltaX > 0) empurra o conteúdo para a esquerda.
 *
 * Só reage a gesto horizontal: a roda vertical continua rolando a página. O listener é
 * não-passivo para poder cancelar o scroll lateral do navegador (e o gesto de voltar de página).
 */
const useWheelDrag = (
  ref: React.RefObject<HTMLDivElement | null>,
  direction: 1 | -1
) => {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onWheel = (event: WheelEvent) => {
      let dx = event.deltaX
      if (dx === 0 && event.shiftKey) dx = event.deltaY
      else if (Math.abs(event.deltaY) > Math.abs(dx)) return
      if (dx === 0) return

      // deltaMode 1 vem em linhas, não em pixels.
      if (event.deltaMode === 1) dx *= 16
      event.preventDefault()

      const travel = el.getBoundingClientRect().width * 0.25
      el.getAnimations().forEach((animation) => {
        const duration = Number(animation.effect?.getComputedTiming().duration)
        if (!duration || !travel) return
        const next =
          (Number(animation.currentTime) || 0) - direction * dx * (duration / travel)
        animation.currentTime = ((next % duration) + duration) % duration
      })
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [ref, direction])
}

const ClientItem = ({ item }: { item: { title: string; image: string } }) => (
  <div className="flex-shrink-0 flex flex-col items-center mx-4">
    <div className="aspect-square w-[140px] md:w-[160px] rounded overflow-hidden bg-gray-800 mb-3">
      {/* URL do Storage: o OptimizedImage gera srcset com parâmetros que só a Vercel entende. */}
      {item.image.startsWith("http") ? (
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          width={160}
          height={160}
          className="w-full h-full object-cover"
        />
      ) : (
        <OptimizedImage
          src={item.image}
          alt={item.title}
          sizes="160px"
          className="w-full h-full object-cover"
          width={160}
          height={160}
        />
      )}
    </div>
    <span className="font-amplitude text-xs md:text-sm text-center text-foreground font-semibold uppercase">
      {item.title}
    </span>
  </div>
);

/** Ao menos esta quantidade por faixa, para a fileira nunca ficar mais curta que a tela. */
const MIN_ITEMS_PER_LOOP = 12

/** Poucos clientes cadastrados: repete a lista até formar uma volta completa. */
const toLoop = (list: SiteClient[]) =>
  list.length === 0 || list.length >= MIN_ITEMS_PER_LOOP
    ? list
    : Array.from({ length: Math.ceil(MIN_ITEMS_PER_LOOP / list.length) }).flatMap(() => list)

const ClientsSection = ({
  dbClients = [],
  dbBrands = [],
}: {
  dbClients?: SiteClient[]
  dbBrands?: SiteClient[]
}) => {
  useScrollAnimation();
  const dbTrack = useRef<HTMLDivElement>(null)
  useSmoothPause(dbTrack)
  useWheelDrag(dbTrack, -1)
  const dbLoop = toLoop(dbClients)

  const dbBrandsTrack = useRef<HTMLDivElement>(null)
  useSmoothPause(dbBrandsTrack)
  useWheelDrag(dbBrandsTrack, 1)
  const dbBrandsLoop = toLoop(dbBrands)

  return (
    <section className="pt-24 pb-60 relative z-10 shadow-section-top overflow-hidden bg-[var(--color-bg-2)] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/picture-wall-bg.webp')" }}>
      <div className="absolute inset-0 bg-white/20 pointer-events-none z-0" />
      
      {/* Section Header */}
      <div className="relative z-10 container mx-auto mb-12 md:mb-16 space-y-1.5 px-8">
        <h3 className="fade-in text-3xl md:text-4xl lg:text-5xl font-amplitude font-bold text-foreground uppercase text-center" suppressHydrationWarning>
          <span className="font-amplitude font-bold text-foreground">CLIENTES</span>
        </h3>
        <p className="fade-in max-w-3xl mx-auto font-amplitude text-foreground text-paragraph text-center" suppressHydrationWarning>
          Personalidades, Artistas e Marcas que confiaram em nossa expertise para transformar suas histórias em experiências audiovisuais memoráveis.
        </p>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Personalidades e artistas cadastrados no painel - Direita para Esquerda */}
        {dbLoop.length > 0 && (
          <div className="relative overflow-hidden">
            <div ref={dbTrack} className="flex w-max animate-scroll-left" style={{ animationDuration: `${dbLoop.length * SECONDS_PER_ITEM}s` }}>
              {[...dbLoop, ...dbLoop, ...dbLoop, ...dbLoop].map((item, index) => (
                <ClientItem key={`db-${index}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Marcas cadastradas no painel - Esquerda para Direita */}
        {dbBrandsLoop.length > 0 && (
          <div className="relative overflow-hidden">
            <div ref={dbBrandsTrack} className="flex w-max animate-scroll-right" style={{ animationDuration: `${dbBrandsLoop.length * SECONDS_PER_ITEM}s` }}>
              {[...dbBrandsLoop, ...dbBrandsLoop, ...dbBrandsLoop, ...dbBrandsLoop].map((item, index) => (
                <ClientItem key={`dbm-${index}`} item={item} />
              ))}
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 50s linear infinite; /* duração real vem do style inline */
        }

        .animate-scroll-right {
          animation: scroll-right 50s linear infinite; /* duração real vem do style inline */
        }

      `}</style>
    </section>
  )
}

export default ClientsSection
