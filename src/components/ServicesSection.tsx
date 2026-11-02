import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { SERVICES } from "@/content/services"
import { OutlineButtonLink } from "@/components/ui/outline-button-link"

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-4 md:gap-6">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/servicos/${service.slug}`}
                className="fade-in group relative block rounded-2xl bg-white/95 p-8 pb-14 transition-shadow duration-500 ease-out hover:shadow-lg"
                suppressHydrationWarning
              >
                <div className="space-y-2">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-bg)] text-white transition-colors duration-500 ease-out group-hover:text-[var(--color-accent-green)]">
                    <service.icon
                      aria-hidden="true"
                      className="h-6 w-6"
                      strokeWidth={1.5}
                    />
                  </span>
                  <h3 className="text-foreground font-amplitude text-xl font-bold leading-snug md:text-2xl">
                    {service.name}
                  </h3>
                  <p className="text-foreground/80 font-amplitude text-paragraph">
                    {service.summary}
                  </p>
                </div>
                {/* Sem hover em telas de toque a seta fica sempre visível; no desktop só no hover. */}
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 h-5 w-5 text-foreground transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-menu-hover)] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
                />
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <OutlineButtonLink href="/servicos">Ver todos os serviços</OutlineButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
