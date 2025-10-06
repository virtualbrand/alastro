import ChromaGrid from "@/components/ui/chroma-grid"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const PERSONALIDADES = [
  { title: "Inst. Vini Jr", image: "/images/personalidades/vini-jr.webp" },
  { title: "Inst. Felipe Neto", image: "/images/personalidades/felipe-neto.webp" },
  { title: "Manu Cit", image: "/images/personalidades/manu-cit.webp" },
  { title: "Malvino Salvador", image: "/images/personalidades/malvino-salvador.webp" },
  { title: "Kyra Gracie", image: "/images/personalidades/kyra-gracie.webp" },
  { title: "Gabriela Prioli", image: "/images/personalidades/gabriela-prioli.webp" },
  { title: "Natalia Guitler", image: "/images/personalidades/natalia-guitler.webp" },
  { title: "Inst. Paulinho", image: "/images/personalidades/instituto-paulinho.webp" },
];

const ARTISTAS = [
  { title: "Xamã", image: "/images/artistas/xama.webp" },
  { title: "Veigh", image: "/images/artistas/veigh.webp" },
  { title: "Gabriel O Pensador", image: "/images/artistas/gabriel-o-pensador.webp" },
  { title: "L7NNON", image: "/images/artistas/l7nnon.webp" },
  { title: "Djonga", image: "/images/artistas/djonga.webp" },
  { title: "Mc Daniel", image: "/images/artistas/mc-daniel.webp" },
  { title: "Maria Gadú", image: "/images/artistas/maria-gadu.webp" },
  { title: "Elba Ramalho", image: "/images/artistas/elba-ramalho.webp" },
];

const MARCAS = [
  { title: "Adidas", image: "/images/marcas/adidas.webp" },
  { title: "Gocase", image: "/images/marcas/gocase.webp" },
  { title: "Nestlé", image: "/images/marcas/nestle.webp" },
  { title: "Corona", image: "/images/marcas/corona.webp" },
  { title: "WSL", image: "/images/marcas/wsl.webp" },
  { title: "Allegra", image: "/images/marcas/allegra.webp" },
  { title: "Bold", image: "/images/marcas/bold.webp" },
  { title: "Dux", image: "/images/marcas/dux.webp" },
];

const ClientsSection = () => {
  return (
    <section className="px-8 pt-24 pb-60 relative overflow-hidden bg-[var(--color-bg-2)] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/picture-wall-bg.webp')" }}>
      <div className="absolute inset-0 bg-white/20 pointer-events-none z-0" />
  <div className="relative z-10 text-center mb-8">
        <motion.h3 
          className="font-amplitude text-3xl md:text-4xl lg:text-5xl font-bold text-foreground uppercase mb-4"
          {...useScrollAnimation({ direction: 'fade', once: true })}
        >
          NOSSOS{" "}
          <span className="font-amplitude font-bold text-foreground">
            CLIENTES
          </span>
        </motion.h3>
        <motion.p 
          className="mx-auto max-w-lg font-amplitude text-foreground sm:text-lg md:text-xl"
          {...useScrollAnimation({ direction: 'fade', once: true })}
        >
          Personalidades, Artistas e Marcas que confiam em nossa expertise para transformar suas histórias em experiências audiovisuais memoráveis.
        </motion.p>
      </div>

      <motion.div 
        className="relative z-10 container mx-auto space-y-12"
        {...useScrollAnimation({ direction: 'fade', once: true })}
      >
        {/* Personalidades */}
        <div>
          <h4 className="font-amplitude text-xl md:text-2xl font-bold text-center text-[var(--color-primary)] mb-4">Personalidades</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {PERSONALIDADES.map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="aspect-square w-full max-w-[130px] sm:max-w-[110px] md:max-w-[120px] lg:max-w-[140px] rounded overflow-hidden bg-gray-800 mb-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-amplitude text-xs md:text-sm text-center text-foreground font-semibold uppercase">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Artistas */}
        <div>
          <h4 className="font-amplitude text-xl md:text-2xl font-bold text-center text-[var(--color-primary)] mb-4">Artistas</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {ARTISTAS.map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="aspect-square w-full max-w-[90px] sm:max-w-[110px] md:max-w-[120px] lg:max-w-[140px] rounded overflow-hidden bg-gray-800 mb-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-amplitude text-xs md:text-sm text-center text-foreground font-bold uppercase">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Marcas */}
        <div>
          <h4 className="font-amplitude text-xl md:text-2xl font-bold text-center text-[var(--color-primary)] mb-4">Marcas</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {MARCAS.map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="aspect-square w-full max-w-[90px] sm:max-w-[110px] md:max-w-[120px] lg:max-w-[140px] rounded overflow-hidden bg-gray-800 mb-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-amplitude text-xs md:text-sm text-center text-foreground font-bold uppercase">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default ClientsSection
