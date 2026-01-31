"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { OptimizedImage } from "@/components/ui/optimized-image"

const PERSONALIDADES_ARTISTAS = [
  { title: "Inst. Vini Jr", image: "/images/clientes/vini-jr.webp" },
  { title: "Manu Cit", image: "/images/clientes/manu-cit.webp" },
  { title: "Inst. Paulinho", image: "/images/clientes/instituto-paulinho.webp" },
  { title: "Natalia Guitler", image: "/images/clientes/natalia-guitler.webp" },
  { title: "Gabriela Prioli", image: "/images/clientes/gabriela-prioli.webp" },
  { title: "Inst. Felipe Neto", image: "/images/clientes/felipe-neto.webp" },
  { title: "Xamã", image: "/images/clientes/xama.webp" },
  { title: "Veigh", image: "/images/clientes/veigh.webp" },
  { title: "Gabriel O Pensador", image: "/images/clientes/gabriel-pensador.webp" },
  { title: "Manu Caiado", image: "/images/clientes/manu-caiado.webp" },
  { title: "Vanessa Giácomo", image: "/images/clientes/vanessa-giacomo.webp" },
  { title: "Zico", image: "/images/clientes/zico.webp" },
  { title: "Maria Gadú", image: "/images/clientes/maria-gadu.webp" },
  { title: "Elba Ramalho", image: "/images/clientes/elba-ramalho.webp" },
];

const MARCAS = [
  { title: "Adidas", image: "/images/clientes/adidas.webp" },
  { title: "Gocase", image: "/images/clientes/gocase.webp" },
  { title: "Nestlé", image: "/images/clientes/nestle.webp" },
  { title: "Xcoach", image: "/images/clientes/x-coach.webp" },
  { title: "Guudrun", image: "/images/clientes/guudrun.png" },
  { title: "Allegra", image: "/images/clientes/allegra.webp" },
  { title: "Bold", image: "/images/clientes/bold.webp" },
  { title: "Dux", image: "/images/clientes/dux.webp" },
];

const ClientItem = ({ item }: { item: { title: string; image: string } }) => (
  <div className="flex-shrink-0 flex flex-col items-center mx-4">
    <div className="aspect-square w-[140px] md:w-[160px] rounded overflow-hidden bg-gray-800 mb-3">
      <OptimizedImage
        src={item.image}
        alt={item.title}
        sizes="160px"
        className="w-full h-full object-cover"
        width={160}
        height={160}
      />
    </div>
    <span className="font-amplitude text-xs md:text-sm text-center text-foreground font-semibold uppercase">
      {item.title}
    </span>
  </div>
);

const ClientsSection = () => {
  useScrollAnimation();
  
  return (
    <section className="sm:px-8 pt-24 pb-60 relative overflow-hidden bg-[var(--color-bg-2)] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/picture-wall-bg.webp')" }}>
      <div className="absolute inset-0 bg-white/20 pointer-events-none z-0" />
      
      {/* Section Header */}
      <div className="relative z-10 container mx-auto mb-12 md:mb-16 space-y-1.5 px-8 sm:px-0">
        <h3 className="fade-in text-3xl md:text-4xl lg:text-5xl font-amplitude font-bold text-foreground uppercase text-center" suppressHydrationWarning>
          <span className="font-amplitude font-bold text-foreground">CLIENTES</span>
        </h3>
        <p className="fade-in max-w-3xl mx-auto font-amplitude text-foreground text-base sm:text-lg md:text-xl leading-normal text-center" suppressHydrationWarning>
          Personalidades, Artistas e Marcas que confiaram em nossa expertise para transformar suas histórias em experiências audiovisuais memoráveis.
        </p>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Personalidades & Artistas - Direita para Esquerda */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-right">
            {[...PERSONALIDADES_ARTISTAS, ...PERSONALIDADES_ARTISTAS].map((item, index) => (
              <ClientItem key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        </div>

        {/* Marcas - Esquerda para Direita */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-left">
            {[...MARCAS, ...MARCAS, ...MARCAS].map((item, index) => (
              <ClientItem key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 8s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .animate-scroll-right {
          animation: scroll-right 8s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        @media (min-width: 768px) {
          .animate-scroll-left {
            animation-duration: 30s;
          }

          .animate-scroll-right {
            animation-duration: 30s;
          }
        }
      `}</style>
    </section>
  )
}

export default ClientsSection
