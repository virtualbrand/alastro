import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/ui/animated-cards-stack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const TESTIMONIALS = [
  {
    id: "testimonial-1",
    name: "Maria Silva",
    profession: "Diretora de Marketing",
    rating: 5,
    description:
      "O trabalho realizado superou todas as nossas expectativas. A qualidade audiovisual e o profissionalismo da equipe foram excepcionais.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: "testimonial-2",
    name: "João Santos",
    profession: "CEO",
    rating: 4.8,
    description:
      "Colaboração incrível do início ao fim. Entregaram exatamente o que precisávamos para nossa campanha institucional.",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: "testimonial-3",
    name: "Ana Costa",
    profession: "Produtora",
    rating: 5,
    description:
      "A atenção aos detalhes e a criatividade da equipe transformaram nossa visão em uma realidade audiovisual impressionante.",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    id: "testimonial-4",
    name: "Carlos Oliveira",
    profession: "Diretor Criativo",
    rating: 4.9,
    description:
      "Profissionalismo exemplar e resultados de alta qualidade. Recomendo fortemente para qualquer projeto audiovisual.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
]

const TestimonialsSection = () => {
  return (
    <section className="bg-accent px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="font-amplitude text-4xl font-bold text-foreground md:text-5xl uppercase mb-4">
          O QUE NOSSOS{" "}
          <span className="font-amplitude font-bold text-primary">
            CLIENTES
          </span>{" "}
          DIZEM
        </h2>
        <p className="mx-auto max-w-lg text-muted-foreground">
          Conheça os depoimentos de quem já trabalhou conosco e descobriu
          <br />
          a diferença que fazemos em cada projeto audiovisual.
        </p>
      </div>
      <ContainerScroll className="container h-[300vh]">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-[450px] w-[350px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <CardTransformed
                arrayLength={TESTIMONIALS.length}
                key={testimonial.id}
                variant="light"
                index={index + 2}
                role="article"
                aria-labelledby={`card-${testimonial.id}-title`}
                aria-describedby={`card-${testimonial.id}-content`}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <ReviewStars
                    className="text-primary"
                    rating={testimonial.rating}
                  />
                  <div className="mx-auto w-4/5 text-lg text-foreground">
                    <blockquote cite="#">"{testimonial.description}"</blockquote>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="!size-12 border border-border">
                    <AvatarImage
                      src={testimonial.avatarUrl}
                      alt={`Foto de ${testimonial.name}`}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="block text-lg font-semibold tracking-tight md:text-xl text-foreground">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {testimonial.profession}
                    </span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  )
}

export default TestimonialsSection