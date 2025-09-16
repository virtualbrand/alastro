import ChromaGrid from "@/components/ui/chroma-grid"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const mockImages = [
  "/images/malvino-salvador.webp",
  "/images/kyra-gracie.webp",
  "/images/camilo.webp",
  "/images/manu-cit.webp",
  "/images/victor.webp"
];

const PERSONALIDADES = [
  { title: "Inst. Vini Jr", image: mockImages[0] },
  { title: "Inst. Felipe Neto", image: mockImages[1] },
  { title: "Manu Cit", image: mockImages[2] },
  { title: "Malvino Salvador", image: mockImages[3] },
  { title: "Kyra Gracie", image: mockImages[4] },
  { title: "Gabriela Prioli", image: mockImages[1] },
  { title: "Natalia Guitler", image: mockImages[2] },
  { title: "Inst. Paulinho", image: mockImages[3] },
];

const ARTISTAS = [
  { title: "Xamã", image: mockImages[2] },
  { title: "Veigh", image: mockImages[3] },
  { title: "Gabriel O Pensador", image: mockImages[4] },
  { title: "L7NNON", image: mockImages[0] },
  { title: "Djonga", image: mockImages[1] },
  { title: "Mc Daniel", image: mockImages[2] },
  { title: "Maria Gadú", image: mockImages[3] },
  { title: "Elba Ramalho", image: mockImages[4] },
];

const MARCAS = [
  { title: "Adidas", image: mockImages[4] },
  { title: "Gocase", image: mockImages[3] },
  { title: "Nestlé", image: mockImages[2] },
  { title: "Corona", image: mockImages[1] },
  { title: "WSL", image: mockImages[0] },
  { title: "Allegra", image: mockImages[1] },
  { title: "Bold", image: mockImages[2] },
  { title: "Dux", image: mockImages[3] },
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
