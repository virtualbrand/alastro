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
      <div className="container mx-auto px-4">
        <div className="mx-auto">
          <h2 className="fade-in text-3xl md:text-4xl font-amplitude font-bold text-foreground text-center mb-8 md:mb-12" suppressHydrationWarning>
            Nossas Frentes de Atuação
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {SERVICES.map((service, index) => (
              <div
                key={index}
                className="fade-in p-6 bg-white/95 rounded-lg"
                suppressHydrationWarning
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
