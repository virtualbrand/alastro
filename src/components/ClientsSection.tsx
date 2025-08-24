import ChromaGrid from "@/components/ui/chroma-grid"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const CLIENTS = [
  {
    image: "/images/cliente.png",
    title: "Cliente 1",
    subtitle: "Projeto 1",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 2",
    subtitle: "Projeto 2",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 3",
    subtitle: "Projeto 3",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 4",
    subtitle: "Projeto 4",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 5",
    subtitle: "Projeto 5",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 6",
    subtitle: "Projeto 6",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 7",
    subtitle: "Projeto 7",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 8",
    subtitle: "Projeto 8",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 9",
    subtitle: "Projeto 9",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 10",
    subtitle: "Projeto 10",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 11",
    subtitle: "Projeto 11",
    url: "#"
  },
  {
    image: "/images/cliente.png",
    title: "Cliente 12",
    subtitle: "Projeto 12",
    url: "#"
  }
]

const ClientsSection = () => {
  return (
    <section className="px-8 pt-24 pb-60 relative overflow-hidden bg-[var(--color-bg-2)] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/picture-wall-bg.webp')" }}>
      <div className="text-center mb-8">
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
          className="mx-auto max-w-lg font-amplitude text-foreground"
          {...useScrollAnimation({ direction: 'fade', once: true })}
        >
          Empresas que confiam em nossa expertise para transformar suas histórias em experiências audiovisuais memoráveis.
        </motion.p>
      </div>

      <motion.div 
          className="container mx-auto"
          {...useScrollAnimation({ direction: 'fade', once: true })}
        >
        <ChromaGrid 
          items={CLIENTS.map((client, index) => ({
            ...client,
            render: (
              <motion.div
                {...useScrollAnimation({ 
                  direction: 'fade',
                  once: true,
                  amount: 0.2
                })}
                style={{ width: '100%', height: '100%' }}
              >
                <img
                  src={client.image}
                  alt={client.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )
          }))}
          className="gap-3"
          radius={400}
          damping={0.5}
          fadeOut={0.8}
          ease="power4.out"
        />
      </motion.div>
    </section>
  )
}

export default ClientsSection
