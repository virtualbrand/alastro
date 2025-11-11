import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/ui/animated-cards-stack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const TESTIMONIALS_ANIMATED = [
  {
    quote: "O projeto foi concluído com muito sucesso. Foi uma prova maravilhosa, muito bem coberta, mesmo com as dificuldades de não ter facilidades como moto. Respeitamos tudo isso e, ainda assim, o resultado ficou impecável. Fiquei muito feliz.\nÉ muito bom estar com uma equipe que leva tudo tão a sério e realmente preza pela máxima qualidade, e dentro do que é possível, fazem sempre o melhor.\nEstou muito feliz e só tenho a agradecer por esse dia maravilhoso.",
    name: "Manu Cit",
    designation: "",
    src: "/images/manu-cit.webp",
  },
  {
    quote: "Já são 3 anos de parceria com a Alastro e a gente fica muito feliz com essa caminhada. Foram 3 anos construindo histórias, contando bastante sobre a nossa trajetória, e nesse tempo conseguimos criar uma conexão e uma sinergia muito forte.\nPra gente, o fundamental é trabalhar com profissionais de bom caráter, honestos e que compartilham valores semelhantes aos nossos, e isso encontramos em vocês.\nEstou muito feliz, sigo muito satisfeito e espero que essa parceria continue por muito tempo.",
    name: "Malvino Salvador",
    designation: "",
    src: "/images/malvino-salvador.webp",
  },
  {
    quote: "Trabalhar com a Alastro nesses últimos 3 anos tem sido fundamental. Nos nossos eventos, onde tudo acontece ao mesmo tempo, eu preciso de uma equipe em quem confio para não perder nenhum momento especial, e eles entregam isso com muita qualidade.\nMais do que profissionais, são parceiros que cresceram junto com a gente e seguem evoluindo a cada projeto. Essa parceria só se fortalece.",
    name: "Kyra Gracie",
    designation: "",
    src: "/images/depoimentos/kyra-gracie.webp",
  },
  {
    quote: "Conheci o Bruno e o Ramon durante uma participação no podcast da Kyra e a conexão foi instantânea. Na época estava interessado em montar um podcast também e acho que por isso trocamos contato. Quando me aprofundei um pouco mais no trabalho deles fiquei encantado com a entrega e começamos a fazer alguns trabalhos juntos. O tempo foi passando, os trabalhos foram acontecendo, as entregas só melhoravam e gosto de brincar e falar pra todo mundo que importamos os meninos de Santa Catarina, trouxemos pro Rio de Janeiro e adotamos eles. Hoje a Alastro está em todos os nossos projetos, muito pela entrega de muita qualidade, claro, mas acho que principalmente pelo profissionalismo, pela relação, pelo carinho com a gente e com os nossos clientes. Essa pra mim é a grande chave, o grande diferencial. O saber chegar e o saber ficar. O que era um trabalho virou uma amizade, mas sem perder, em nenhum momento, o lado profissional da coisa. Acompanho e vibro com as vitórias deles com outros clientes. E sou extremante satisfeito com o que eles me entregam de conteúdo, como se desdobram para atender, entendem quando realmente preciso de ajuda. Sou #TeamAlastro.",
    name: "Camilo Coelho",
    designation: "",
    src: "/images/camilo.webp",
  },
  {
    quote: "Considero a Alastro a melhor opção no mercado audiovisual porque, com eles, o humano sempre se sobrepõe ao técnico. É impressionante a capacidade que o time tem de se adaptar às situações e se conectar com as histórias que contam. Os vídeos acabam sendo as consequências (positivas) dessa interação cheia de intenção e afeto.",
    name: "Victor Ladeira",
    designation: "",
    src: "/images/depoimentos/victor.webp",
  },
  {
    quote: "Energia boa, trabalho de excelência e comprometimento em entregar o melhor, assim definimos a Alastro. Eles chegaram de mansinho, falando pouco e observando muito, e entregaram muito mais do que esperávamos.",
    name: "Natalia Fiorito",
    designation: "",
    src: "/images/depoimentos/natalia.webp",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-[var(--color-bg-2)] sm:px-8 pt-24 pb-72 relative overflow-hidden z-[1] shadow-[0_-25px_40px_-15px_rgba(0,0,0,0.3)]">
      {/* Section Header */}
      <div className="container mx-auto mb-12 md:mb-24 space-y-1.5 px-8 sm:px-0">
        <h2 className="font-amplitude text-3xl md:text-4xl lg:text-5xl font-bold text-foreground uppercase text-center">
          O QUE NOSSOS <span className="font-amplitude font-bold text-foreground">CLIENTES</span> DIZEM
        </h2>
        <p className="max-w-3xl mx-auto text-foreground font-amplitude text-base sm:text-lg md:text-xl leading-normal text-center">
          Conheça os depoimentos de quem já trabalhou conosco e descobriu a diferença que fazemos em cada projeto audiovisual.
        </p>
      </div>
      
      <div className="relative">
        <AnimatedTestimonials testimonials={TESTIMONIALS_ANIMATED} />
      </div>
    </section>
  )
}

export default TestimonialsSection

