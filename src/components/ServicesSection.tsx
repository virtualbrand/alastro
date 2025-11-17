import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const SERVICES = [
  "Produção Audiovisual de Alto Impacto",
  "Conteúdo Estratégico",
  "Gestão e Inteligência de Redes Sociais",
  "Branding e Construção de Marca",
  "Marketing Digital e Performance",
  "Direção Criativa e Storytelling",
  "Planejamento Estratégico de Crescimento",
  "Consultoria para Negócios e Criadores",
  "Tráfego Pago"
]

const ServicesSection = () => {
  useScrollAnimation()

  return (
    <section 
      id="servicos" 
      className="w-screen bg-[var(--color-bg-2)] overflow-x-hidden py-16 md:py-24 lg:py-32"
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 space-y-6 px-4">
          <p className="fade-in font-amplitude text-foreground text-base sm:text-lg md:text-xl leading-relaxed text-center">
            Na Alastro, nos comunicamos como <strong>produtora</strong> porque entregamos excelência audiovisual, mas nossa atuação é muito maior.
          </p>
          <p className="fade-in font-amplitude text-foreground text-base sm:text-lg md:text-xl leading-relaxed text-center">
            Somos uma <strong>Agência 360</strong> que une estratégia, criatividade e gestão para impulsionar marcas, fortalecer posicionamentos e transformar comunicação em resultado real.
          </p>
        </div>

        {/* Services Grid */}
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="fade-in text-2xl md:text-3xl lg:text-4xl font-amplitude font-bold tracking-tighter text-foreground text-center mb-8 md:mb-12">
            Nossas Frentes de Atuação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {SERVICES.map((service, index) => (
              <div
                key={index}
                className="fade-in p-6 bg-white/95 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="text-foreground/40 font-amplitude font-bold text-lg mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-foreground font-amplitude text-base md:text-lg leading-snug">
                    {service}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
