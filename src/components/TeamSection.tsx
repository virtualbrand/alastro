import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

const TeamSection = () => {
  return (
    <section className="w-screen relative overflow-hidden bg-[var(--color-bg-2)]">
      <div className="flex flex-col md:flex-row">
        {/* Imagem à esquerda */}
        <motion.div
          className="w-full md:w-1/2 relative"
          {...useScrollAnimation({ direction: 'left', once: true })}
        >
          <img
            src="/images/nosso-time.jpg"
            alt="Time Alastro"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Conteúdo à direita */}
        <div className="w-full md:w-1/2 px-8 md:px-16 py-12 flex items-center bg-[var(--color-bg-3)]">
          <div className="max-w-xl">
            <motion.h2
              className="font-amplitude text-3xl md:text-4xl lg:text-5xl lg:text-6xl font-bold text-foreground uppercase mb-6"
              {...useScrollAnimation({ direction: 'right', once: true })}
            >
              NOSSO{" "}
              <span className="font-amplitude font-bold text-foreground">
                TIME
              </span>
            </motion.h2>
            <motion.p
              className="text-foreground font-amplitude sm:text-lg md:text-xl leading-normal"
              {...useScrollAnimation({ direction: 'right', once: true })}
            >
              Nossa equipe é formada por profissionais apaixonados por audiovisual,
              comprometidos em transformar suas ideias em produções excepcionais.
              Com experiência diversificada e criatividade sem limites, estamos
              prontos para dar vida à sua visão.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamSection
