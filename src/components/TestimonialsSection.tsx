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
    quote: `Foi muito emocionante participar dessa gravação.
  Esses quatro dias, recapitulando a minha história e falando sobre cada detalhe do passado, me fizeram lembrar de tudo o que foi vivido e de tudo o que a gente está construindo.
  E, mais do que isso, o carinho da equipe da Alastro foi sensacional. Eu me senti completamente à vontade com eles. Eu tenho dificuldade em falar em público, e não tive nenhuma durante a gravação. Me senti como se estivesse com amigos.
  O profissionalismo deles é nota mil. Eu nunca participei de uma gravação com um nível tão alto de perfeccionismo em cada detalhe. Foi realmente impressionante.
  Eu recomendaria a Alastro para qualquer pessoa, até para o meu melhor amigo. E tenho certeza de que construí amigos aqui nesses quatro dias. A gente teve uma troca tão boa, tão profunda, tão leve… Foi tudo muito suave e emocionante, de verdade.
  Estou muito feliz com essa gravação. Estou com uma expectativa gigantesca e super curiosa para ver esse filme. Tenho certeza, pelo que vi aqui e pelo nível do trabalho deles, que vai ficar maravilhoso.
  Vou agradecer por ter esse filme da minha vida, até este momento, pelo resto da vida.
  Muito obrigada, Alastro. Muito obrigada, Bruno. Muito obrigada a toda a equipe. Vocês são sensacionais. Muito obrigada!`,
    name: "Corina Godoy",
    designation: "",
    src: "/images/depoimentos/corina.webp",
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
    quote: "Para mim, é um prazer ter a Alastro como parceira em todos os meus projetos. O que mais me impressiona é a capacidade deles de transitar por diferentes temas, plataformas e formatos com a mesma qualidade e consistência.Hoje, eles produzem desde documentários e podcasts até publiposts e campanhas completas. Encontrar um parceiro com essa versatilidade e capacidade de adaptação faz toda a diferença. É por isso que a Alastro está presente nos meus projetos e que eu a recomendo com confiança para todos os meus parceiros.",
    name: "Phillipe Angeli",
    designation: "",
    src: "/images/depoimentos/phillipe.webp",
  },
  {
    quote: "Energia boa, trabalho de excelência e comprometimento em entregar o melhor, assim definimos a Alastro. Eles chegaram de mansinho, falando pouco e observando muito, e entregaram muito mais do que esperávamos.",
    name: "Natalia Fiorito",
    designation: "",
    src: "/images/depoimentos/natalia.webp",
  },
  {
    quote: `Conhecer a Alastro foi muito mais do que encontrar um time de audiovisual. Foi encontrar pessoas que entendem que por trás de cada projeto existe uma história, uma visão e um propósito que merece ser contado com cuidado.
  Desde o primeiro contato, o que nos surpreendeu não foi só a qualidade técnica, foi a forma como eles nos ouviram. Ouviram o que a Viga é, o que quer ser, e o que ainda está construindo. E traduziram tudo isso em imagem, em vídeo, em narrativa.
  Com a Alastro, não contratamos um serviço. Ganhamos parceiros que vibram com as nossas conquistas, que nos desafiam a comunicar melhor e que entregam com um nível de excelência que faz a gente querer crescer para estar à altura do que eles produzem.
  São profissionais excepcionais. E, mais do que isso, são pessoas que a gente tem o privilégio de chamar de amigos.`,
    name: "Gabriela Tanese",
    designation: "",
    src: "/images/depoimentos/gabi.webp",
  },
  {
    quote: `A parceria entre a ID.MIDIAS e a Alastro já dura aproximadamente 3 anos, e durante todo esse período eles se consolidaram como um dos parceiros mais confiáveis e competentes com quem já trabalhamos.
Em um mercado onde muitas empresas prometem muito e entregam pouco, a Alastro se destaca pela capacidade de transformar ideias em projetos executados com excelência, organização e um padrão de qualidade extremamente elevado.
Tivemos a oportunidade de desenvolver diversos projetos juntos e, em todos eles, percebemos o mesmo compromisso com o resultado final. Desde o atendimento inicial até a entrega, existe um cuidado genuíno com cada detalhe, uma comunicação clara e uma preocupação constante em superar expectativas.
O que mais admiramos na Alastro é a combinação rara entre criatividade, profissionalismo e capacidade de execução. Não basta ter boas ideias; é preciso ter método, equipe e comprometimento para tirar os projetos do papel com consistência. E isso eles fazem de forma exemplar.
Hoje, quando pensamos em produção audiovisual e projetos que exigem alto nível de qualidade, a Alastro é  a primeira empresa que nos vem à mente. É uma parceria construída com confiança, respeito e resultados reais ao longo dos anos.
Sem dúvida, uma empresa que recomendamos de olhos fechados para qualquer negócio que busca elevar o nível da sua comunicação, fortalecer sua marca e produzir materiais que realmente geram impacto`,
    name: "Cesar Machado",
    designation: "",
    src: "/images/depoimentos/cesar.webp",
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

