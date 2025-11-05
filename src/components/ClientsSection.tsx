import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const PERSONALIDADES = [
  { title: "Inst. Vini Jr", image: "/images/clientes/vini-jr.webp" },
  { title: "Inst. Felipe Neto", image: "/images/clientes/felipe-neto.webp" },
  { title: "Manu Cit", image: "/images/clientes/manu-cit.webp" },
  { title: "Malvino Salvador", image: "/images/clientes/malvino-salvador.webp" },
  { title: "Kyra Gracie", image: "/images/clientes/kyra-gracie.webp" },
  { title: "Gabriela Prioli", image: "/images/clientes/gabriela-prioli.webp" },
  { title: "Natalia Guitler", image: "/images/clientes/natalia-guitler.webp" },
  { title: "Inst. Paulinho", image: "/images/clientes/instituto-paulinho.webp" },
];

const ARTISTAS = [
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
  { title: "X Coach", image: "/images/clientes/x-coach.webp" },
  { title: "Gracie Kore", image: "/images/clientes/gracie-kore.webp" },
  { title: "Allegra", image: "/images/clientes/allegra.webp" },
  { title: "Bold", image: "/images/clientes/bold.webp" },
  { title: "Dux", image: "/images/clientes/dux.webp" },
];

const ClientsSection = () => {
  useScrollAnimation();
  
  return (
    <section className="sm:px-8 pt-24 pb-60 relative overflow-hidden bg-[var(--color-bg-2)] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/picture-wall-bg.webp')" }}>
      <div className="absolute inset-0 bg-white/20 pointer-events-none z-0" />
      
      {/* Section Header */}
      <div className="relative z-10 container mx-auto mb-8 md:mb-12 space-y-1.5 px-8 sm:px-0">
        <h3 className="fade-in text-3xl md:text-4xl lg:text-5xl font-amplitude font-bold text-foreground uppercase text-center">
          NOSSOS <span className="font-amplitude font-bold text-foreground">CLIENTES</span>
        </h3>
        <p className="fade-in max-w-3xl mx-auto font-amplitude text-foreground text-base sm:text-lg md:text-xl leading-normal text-center">
          Personalidades, Artistas e Marcas que confiam em nossa expertise para transformar suas histórias em experiências audiovisuais memoráveis.
        </p>
      </div>

      <div className="relative z-10 container mx-auto space-y-12 px-8 sm:px-0">
        {/* Personalidades */}
        <div>
          {/* <h4 className="font-amplitude text-xl md:text-2xl font-bold text-center text-[var(--color-primary)] mb-2">Personalidades</h4> */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {PERSONALIDADES.map((item) => (
              <div key={item.title} className="fade-in flex flex-col items-center">
                <div className="aspect-square w-full max-w-[150px] sm:max-w-[130px] md:max-w-[140px] lg:max-w-[160px] rounded overflow-hidden bg-gray-800 mb-3">
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
          {/* <h4 className="font-amplitude text-xl md:text-2xl font-bold text-center text-[var(--color-primary)] mb-2">Artistas</h4> */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {ARTISTAS.map((item) => (
              <div key={item.title} className="fade-in flex flex-col items-center">
                <div className="aspect-square w-full max-w-[150px] sm:max-w-[130px] md:max-w-[140px] lg:max-w-[160px] rounded overflow-hidden bg-gray-800 mb-3">
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
          {/* <h4 className="font-amplitude text-xl md:text-2xl font-bold text-center text-[var(--color-primary)] mb-2">Marcas</h4> */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {MARCAS.map((item) => (
              <div key={item.title} className="fade-in flex flex-col items-center">
                <div className="aspect-square w-full max-w-[150px] sm:max-w-[130px] md:max-w-[140px] lg:max-w-[160px] rounded overflow-hidden bg-gray-800 mb-3">
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
      </div>
    </section>
  )
}

export default ClientsSection
