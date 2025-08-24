import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/ui/animated-cards-stack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

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

const TESTIMONIALS_ANIMATED = [
  {
    quote: "O trabalho realizado superou todas as nossas expectativas. A qualidade audiovisual e o profissionalismo da equipe foram excepcionais.",
    name: "Maria Silva",
    designation: "Diretora de Marketing",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    quote: "Colaboração incrível do início ao fim. Entregaram exatamente o que precisávamos para nossa campanha institucional.",
    name: "João Santos",
    designation: "CEO",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    quote: "A atenção aos detalhes e a criatividade da equipe transformaram nossa visão em uma realidade audiovisual impressionante.",
    name: "Ana Costa",
    designation: "Produtora",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    quote: "Profissionalismo exemplar e resultados de alta qualidade. Recomendo fortemente para qualquer projeto audiovisual.",
    name: "Carlos Oliveira",
    designation: "Diretor Criativo",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-[var(--color-bg-2)] px-8 pt-24 pb-72 relative overflow-hidden z-[1] shadow-[0_-25px_40px_-15px_rgba(0,0,0,0.3)]">
      <div className="text-center mb-12 md:mb-24">
        <h2 className="font-amplitude text-4xl font-bold text-foreground md:text-5xl uppercase mb-4">
          O QUE NOSSOS{" "}
          <span className="font-amplitude font-bold text-foreground">
            CLIENTES
          </span>{" "}
          DIZEM
        </h2>
        <p className="mx-auto max-w-lg text-foreground font-amplitude text-base leading-normal">
          Conheça os depoimentos de quem já trabalhou conosco e descobriu
          <br />
          a diferença que fazemos em cada projeto audiovisual.
        </p>
      </div>
      <div className="relative">
        <AnimatedTestimonials testimonials={TESTIMONIALS_ANIMATED} />
      </div>
    </section>
  )
}

export default TestimonialsSection

