/**
 * Serviços da Alastro: fonte única para o arquivo /servicos, as subpáginas
 * /servicos/[slug], o sitemap e a seção de serviços da home.
 *
 * Os textos vêm do documento "Reformulação do Site – Textos Aprovados".
 * Ficam no código, e não no painel, porque são conteúdo institucional
 * estável: mudar o texto passa por revisão e deploy.
 *
 * `related` alimenta o link building interno: cada página aponta para os
 * serviços que de fato se complementam, não para uma lista genérica.
 */

import {
  BookOpen,
  Clapperboard,
  Fingerprint,
  Handshake,
  Lightbulb,
  Megaphone,
  Share2,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { SERVICE_LINKS } from "./service-links";
import type { ServiceMediaKey } from "./service-media";

export interface ServiceSection {
  title: string;
  paragraphs: string[];
}

export interface Service {
  slug: string;
  icon: LucideIcon;
  /** Foto da seção em /servicos (arquivo em /public). Troque aqui por uma foto específica do serviço. */
  image: string;
  /** Vídeos das seções 50/50 da página, na ordem (se houver mais seções que vídeos, repete). */
  media: ServiceMediaKey[];
  name: string;
  /** Frase de abertura da página. */
  headline: string;
  /** Resumo curto para cards e listagens. */
  summary: string;
  intro: string[];
  sections: ServiceSection[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  /** Slugs de serviços complementares, em ordem de relevância. */
  related: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "producao-audiovisual",
    icon: Clapperboard,
    image: "/images/capas/bastidores-ironman-manu-cit.webp",
    media: ["doc-manu", "xama", "guudrun-sp", "ironman-bts", "vinijr-jantar"],
    name: "Produção Audiovisual de Alto Impacto",
    headline:
      "Transformamos grandes histórias em produções audiovisuais que merecem ser lembradas.",
    summary:
      "Documentários, filmes para marcas, campanhas, shows, festivais e fotografia, da ideia à entrega.",
    intro: [
      "A Alastro é uma produtora audiovisual brasileira especializada em documentários, filmes para marcas, campanhas, produções para artistas, cobertura de eventos, festivais, fotografia e conteúdos digitais.",
      "Com seis anos de trajetória, desenvolvemos projetos que unem planejamento, direção criativa, storytelling, linguagem cinematográfica e excelência técnica. Ao longo desse caminho, tivemos a oportunidade de construir histórias com Instituto Vini Jr., Xamã, Manu Cit, Bia Ben, Veigh, 99, DUX, Bold, Uber, Gocase, G4 Educação e muitos outros clientes e parceiros que ajudaram a formar aquilo que a Alastro é hoje.",
      "Acreditamos que uma produção audiovisual de alto impacto precisa ir além de imagens bonitas. Ela deve compreender a história, transmitir sua mensagem e criar uma conexão verdadeira com o público.",
    ],
    sections: [
      {
        title: "Documentários e histórias reais",
        paragraphs: [
          "O documentário é uma das principais expressões da nossa identidade.",
          "Acompanhamos durante dez meses a preparação de Manu Cit para o Ironman 70.3 do Rio de Janeiro, desenvolvendo uma série de 21 episódios e um documentário de 40 minutos sobre o dia da prova. O filme foi produzido e publicado no YouTube em tempo real, enquanto a competição acontecia, em uma operação que uniu narrativa documental, planejamento de captação, agilidade de pós-produção e uma equipe totalmente conectada ao que estava acontecendo naquele momento. O projeto ganhou grande repercussão.",
          "Também produzimos um documentário de carreira de Veigh logo após o artista alcançar o primeiro lugar no Spotify Brasil, registrando um momento especial de sua trajetória.",
          "Para o G4 Educação, percorremos o Brasil para conhecer os fundadores por trás de grandes empresas e contar as histórias que existem por trás de seus resultados. Entramos em suas operações, conhecemos suas trajetórias e buscamos entender as decisões, os desafios e os acontecimentos que fizeram aqueles negócios chegarem até ali.",
          "Nossa experiência documental também passa por histórias profundamente pessoais, como a de Corina Godoy, e por projetos de longa duração como o Instituto Vini Jr., para o qual produzimos há quatro anos documentários, lançamentos e coberturas audiovisuais que registram o desenvolvimento desse grande projeto.",
        ],
      },
      {
        title: "Filmes para marcas e instituições",
        paragraphs: [
          "Desenvolvemos produções audiovisuais que ajudam empresas e instituições a comunicar suas histórias, apresentar seus projetos, lançar produtos, registrar grandes momentos e fortalecer sua identidade.",
          "Não partimos de uma fórmula. Buscamos entender o negócio, o público, o contexto e aquilo que precisa ser sentido por quem assiste. A partir disso, construímos a linguagem, a narrativa e a operação de produção mais adequada para cada projeto.",
          "Esse olhar nos permite atuar tanto em grandes filmes e campanhas quanto em projetos contínuos, séries, conteúdos institucionais e produções pensadas para diferentes plataformas.",
        ],
      },
      {
        title: "Cobertura de eventos, shows e festivais",
        paragraphs: [
          "Realizamos coberturas audiovisuais de grandes eventos, shows, festivais, competições esportivas, feiras e experiências de marca, com operações desenhadas de acordo com a dimensão e a velocidade de cada projeto.",
          "No Rock in Rio, estivemos presentes em oito dos nove dias de festival, realizando produções para Albis, TIM e Movida, além do trabalho desenvolvido com Xamã. A produção com o artista incluiu ensaios e show e resultou em um filme muito elogiado por ele, que chegou a comentar que o material poderia ser o clipe de seu álbum Flerte.",
          "Nossa trajetória em festivais também inclui Lollapalooza, Planeta Atlântida, Rap in Cena e Coachella, experiências que ampliaram nossa capacidade de trabalhar em ambientes de grande escala, com múltiplos acontecimentos simultâneos e necessidade de respostas rápidas.",
          "Dependendo do projeto, estruturamos equipes com direção, produção, videomakers, fotógrafos, operadores de drone, captação mobile e editores, incluindo operações com entregas em tempo real.",
        ],
      },
      {
        title: "Da ideia à entrega",
        paragraphs: [
          "Nossa atuação abrange todo o processo audiovisual. Participamos da pesquisa, desenvolvimento do conceito, direção criativa, roteiro, pré-produção, planejamento, produção, direção, captação, fotografia, áudio, drone, pós-produção, edição, tratamento de imagem, desenho de som, finalização e entrega.",
          "Isso nos permite acompanhar um projeto desde a primeira conversa até o momento em que o filme encontra o público, preservando a ideia, a narrativa e o padrão de qualidade em todas as etapas.",
          "Mais do que executar um briefing, queremos compreender a importância de cada projeto e participar verdadeiramente da sua construção.",
          "Porque não produzimos apenas vídeos. Contamos histórias que nossos clientes terão orgulho de compartilhar.",
        ],
      },
    ],
    seoTitle: "Produtora Audiovisual, Documentários e Eventos | Alastro",
    seoDescription:
      "Produtora audiovisual brasileira: documentários, filmes para marcas, campanhas, shows e festivais, da ideia à entrega. Conheça a Alastro.",
    keywords: [
      "produtora audiovisual",
      "documentário",
      "filme institucional",
      "cobertura de eventos",
      "cobertura de festivais",
      "produção de vídeo para marcas",
    ],
    related: [
      "direcao-criativa-storytelling",
      "conteudo-estrategico",
      "consultoria-negocios-criadores",
    ],
  },
  {
    slug: "conteudo-estrategico",
    icon: Lightbulb,
    image: "/images/capas/cover-guudrun-sp.webp",
    media: ["viniday-bts", "xama", "guudrun-bts"],
    name: "Conteúdo Estratégico",
    headline:
      "Conteúdo com propósito, criatividade e uma estratégia por trás de cada publicação.",
    summary:
      "Planejamento editorial e produção de vídeos e fotos que aproximam marcas de seus públicos.",
    intro: [
      "Produzir conteúdo não é simplesmente manter uma marca ativa nas redes sociais. É compreender o que ela representa, com quem deseja se comunicar e como cada conteúdo pode contribuir para seus objetivos.",
      "Na Alastro, unimos planejamento editorial, estratégia de comunicação e produção audiovisual para desenvolver conteúdos que aproximam marcas de seus públicos.",
      "Nossa experiência em marketing e audiovisual permite pensar tanto na mensagem quanto na execução, criando conteúdos que tenham identidade, consistência e relevância.",
    ],
    sections: [
      {
        title: "Uma estratégia para cada marca",
        paragraphs: [
          "Começamos pela compreensão do negócio, de seus produtos, serviços, público e posicionamento.",
          "A partir desse diagnóstico, desenvolvemos linhas editoriais, definimos formatos e identificamos oportunidades de comunicação.",
          "Nossa atuação inclui vídeos, fotografias, conteúdos educativos, campanhas, séries, bastidores, entrevistas e produções pensadas especificamente para plataformas como Instagram, TikTok e YouTube.",
          "Também trabalhamos com o aproveitamento estratégico de grandes produções, transformando um documentário, uma campanha ou a cobertura de um evento em diferentes conteúdos que ampliam sua vida útil.",
        ],
      },
      {
        title: "Produção contínua e planejamento editorial",
        paragraphs: [
          "Para marcas que precisam manter uma comunicação frequente, desenvolvemos calendários de conteúdo e operações de produção recorrentes.",
          "Integramos estratégia, captação e edição para construir uma comunicação consistente, respeitando a identidade e os objetivos de cada cliente.",
          "Nossa experiência com projetos de longa duração nos permite compreender a evolução das marcas e adaptar os conteúdos às diferentes etapas de seus negócios.",
          "O resultado é uma produção que não depende apenas de tendências passageiras, mas de uma estratégia construída para comunicar aquilo que realmente diferencia cada marca.",
        ],
      },
    ],
    seoTitle: "Produção de Conteúdo Estratégico para Marcas | Alastro",
    seoDescription:
      "Planejamento editorial e produção de conteúdo audiovisual para Instagram, TikTok e YouTube, com estratégia em cada publicação.",
    keywords: [
      "produção de conteúdo",
      "conteúdo estratégico",
      "planejamento editorial",
      "conteúdo para Instagram",
      "conteúdo para YouTube",
    ],
    related: [
      "gestao-redes-sociais",
      "producao-audiovisual",
      "marketing-digital-performance",
    ],
  },
  {
    slug: "gestao-redes-sociais",
    icon: Share2,
    image: "/images/capas/bastidores-amaze.webp",
    media: ["ironman-bts", "guudrun-sp", "viniday-bts", "doc-manu"],
    name: "Gestão e Inteligência de Redes Sociais",
    headline:
      "Redes sociais que comunicam, conectam e evoluem com o seu negócio.",
    summary:
      "Gestão de redes sociais integrada à estratégia, ao conteúdo e à análise de resultados.",
    intro: [
      "Uma presença digital consistente exige mais do que frequência de publicação. É necessário compreender o comportamento do público, acompanhar os resultados e transformar informações em decisões.",
      "Na Alastro, trabalhamos a gestão de redes sociais de maneira integrada à estratégia de comunicação e à produção de conteúdo.",
      "Nosso objetivo é construir canais que representem a identidade de cada marca e contribuam para seus objetivos comerciais e institucionais.",
    ],
    sections: [
      {
        title: "Gestão orientada por estratégia",
        paragraphs: [
          "Desenvolvemos planejamentos editoriais, organizamos calendários, acompanhamos publicações e analisamos o desempenho dos conteúdos.",
          "Consideramos as particularidades de cada plataforma, o comportamento dos públicos e os formatos que fazem sentido para cada negócio.",
          "O planejamento também contempla lançamentos, campanhas, datas importantes, oportunidades de mercado e acontecimentos relevantes para a marca.",
        ],
      },
      {
        title: "Inteligência e análise de resultados",
        paragraphs: [
          "Acompanhamos indicadores como alcance, engajamento, visualizações, retenção, crescimento de audiência e interações, de acordo com os objetivos definidos para cada projeto.",
          "Esses dados ajudam a identificar quais assuntos despertam interesse, quais formatos funcionam melhor e onde existem oportunidades de melhoria.",
          "A análise orienta os próximos planejamentos e permite que a comunicação evolua com base em informações, sem depender exclusivamente de percepções subjetivas.",
        ],
      },
      {
        title: "Integração com o audiovisual",
        paragraphs: [
          "Um dos nossos diferenciais é a capacidade de integrar a gestão das redes sociais à produção audiovisual.",
          "Isso permite desenvolver conteúdos originais, aproveitar materiais de campanhas e documentários e organizar operações recorrentes com maior consistência visual e narrativa.",
          "Também podemos trabalhar em colaboração com equipes internas, oferecendo direcionamento criativo, apoio editorial e orientação sobre produção de conteúdo.",
        ],
      },
    ],
    seoTitle: "Gestão Estratégica de Redes Sociais | Alastro",
    seoDescription:
      "Gestão de redes sociais com planejamento editorial, análise de indicadores e integração com a produção audiovisual.",
    keywords: [
      "gestão de redes sociais",
      "social media",
      "inteligência de redes sociais",
      "calendário editorial",
      "análise de engajamento",
    ],
    related: [
      "conteudo-estrategico",
      "marketing-digital-performance",
      "trafego-pago",
    ],
  },
  {
    slug: "branding",
    icon: Fingerprint,
    image: "/images/capas/bastidores-guudrun.webp",
    media: ["vinijr-jantar", "guudrun-bts", "xama"],
    name: "Branding e Construção de Marca",
    headline: "Marcas fortes têm identidade. Marcas memoráveis têm histórias.",
    summary:
      "Posicionamento, narrativa e identidade para marcas que querem ser reconhecidas pelo que são.",
    intro: [
      "Construir uma marca é muito mais do que desenvolver um logotipo ou escolher uma identidade visual. É definir como uma empresa deseja ser reconhecida, quais valores orientam suas decisões e o que a diferencia em seu mercado.",
      "Na Alastro, conectamos estratégia, posicionamento e criatividade para ajudar marcas a construir uma identidade consistente e uma comunicação que represente sua essência.",
      "Nossa experiência com marketing, direção criativa e storytelling contribui para desenvolver narrativas que aproximam empresas de seus públicos.",
    ],
    sections: [
      {
        title: "Descobrir o que torna uma marca única",
        paragraphs: [
          "Todo projeto começa com uma imersão no negócio.",
          "Buscamos compreender sua origem, seus valores, seus produtos, sua cultura, seu público e seus objetivos de longo prazo.",
          "A partir dessas informações, trabalhamos o posicionamento, a proposta de valor, os territórios de comunicação e a narrativa da marca.",
          "O objetivo é construir uma identidade que faça sentido para a empresa e possa orientar suas diferentes iniciativas de comunicação.",
        ],
      },
      {
        title: "Uma identidade presente em cada ponto de contato",
        paragraphs: [
          "Uma marca precisa ser reconhecível e coerente em seus diferentes canais.",
          "Por isso, conectamos os direcionamentos estratégicos à linguagem visual, ao conteúdo, às campanhas e às produções audiovisuais.",
          "Nosso trabalho pode envolver o desenvolvimento de conceitos, direcionamento de identidade, tom de voz, narrativa institucional e orientações para a comunicação.",
          "Acreditamos que marcas se fortalecem quando existe consistência entre aquilo que dizem, aquilo que fazem e a experiência que proporcionam às pessoas.",
        ],
      },
    ],
    seoTitle: "Branding, Posicionamento e Construção de Marca | Alastro",
    seoDescription:
      "Branding e construção de marca: posicionamento, proposta de valor, tom de voz e narrativa institucional conectados ao audiovisual.",
    keywords: [
      "branding",
      "construção de marca",
      "posicionamento de marca",
      "identidade de marca",
      "tom de voz",
    ],
    related: [
      "direcao-criativa-storytelling",
      "planejamento-estrategico-crescimento",
      "producao-audiovisual",
    ],
  },
  {
    slug: "marketing-digital-performance",
    icon: TrendingUp,
    image: "/images/capas/99food.webp",
    media: ["guudrun-sp", "ironman-bts", "vinijr-jantar"],
    name: "Marketing Digital e Performance",
    headline:
      "Criatividade e estratégia trabalhando para alcançar objetivos reais.",
    summary:
      "Estratégias que integram conteúdo, campanhas e análise de resultados aos objetivos do negócio.",
    intro: [
      "O marketing digital precisa conectar as ações de comunicação aos objetivos do negócio.",
      "Na Alastro, desenvolvemos estratégias que integram conteúdo, posicionamento, campanhas e análise de resultados, buscando construir uma presença digital que contribua para o crescimento das marcas.",
      "Nossa abordagem começa pela compreensão do negócio. Antes de definir canais, campanhas ou formatos, procuramos entender o mercado, o público e os resultados que o cliente deseja alcançar.",
    ],
    sections: [
      {
        title: "Estratégias integradas",
        paragraphs: [
          "Trabalhamos para conectar as diferentes frentes do marketing digital, evitando que redes sociais, campanhas e produção de conteúdo funcionem como iniciativas isoladas.",
          "O planejamento pode envolver ações de reconhecimento de marca, relacionamento com o público, divulgação de produtos e serviços, geração de oportunidades comerciais e campanhas de conversão.",
          "Cada estratégia considera o momento do negócio, seus recursos disponíveis e as prioridades estabelecidas.",
        ],
      },
      {
        title: "Criatividade orientada por resultados",
        paragraphs: [
          "Nossa experiência em produção audiovisual permite desenvolver materiais específicos para campanhas digitais.",
          "Criamos vídeos, peças publicitárias e conteúdos adaptados aos diferentes canais e etapas da jornada do consumidor.",
          "O acompanhamento dos resultados permite identificar oportunidades de otimização, testar abordagens criativas e ajustar as estratégias conforme os dados disponíveis.",
          "Mais do que produzir campanhas, buscamos construir uma comunicação que contribua para os objetivos de cada negócio.",
        ],
      },
    ],
    seoTitle: "Marketing Digital e Estratégias de Performance | Alastro",
    seoDescription:
      "Marketing digital e performance com estratégia, conteúdo, campanhas e análise de resultados ligados aos objetivos do seu negócio.",
    keywords: [
      "marketing digital",
      "marketing de performance",
      "campanhas digitais",
      "estratégia digital",
      "geração de oportunidades comerciais",
    ],
    related: [
      "trafego-pago",
      "planejamento-estrategico-crescimento",
      "gestao-redes-sociais",
    ],
  },
  {
    slug: "direcao-criativa-storytelling",
    icon: BookOpen,
    image: "/images/capas/cover-xama.webp",
    media: ["xama", "ironman-bts", "doc-manu", "viniday-bts"],
    name: "Direção Criativa e Storytelling",
    headline:
      "Toda grande história merece uma maneira extraordinária de ser contada.",
    summary:
      "Conceito, roteiro e narrativa: encontramos a história por trás de cada projeto.",
    intro: [
      "Acreditamos que as melhores produções começam muito antes de uma câmera ser ligada.",
      "Começam com perguntas, conversas, pesquisa e a capacidade de encontrar aquilo que torna uma história verdadeiramente interessante.",
      "Na Alastro, a direção criativa e o storytelling estão presentes na maneira como pensamos nossos projetos. Unimos experiência em marketing, sensibilidade narrativa e conhecimento audiovisual para desenvolver conceitos que transformam ideias em experiências.",
    ],
    sections: [
      {
        title: "Encontrar a história por trás de cada projeto",
        paragraphs: [
          "Nosso trabalho começa pela escuta.",
          "Queremos compreender quem são as pessoas envolvidas, quais acontecimentos marcaram suas trajetórias e o que torna cada projeto especial.",
          "Foi essa abordagem que nos levou a acompanhar Manu Cit durante dez meses de preparação para um Ironman, a percorrer o Brasil conhecendo fundadores de grandes empresas nos documentários do G4 Educação e a registrar a trajetória de Corina Godoy em uma produção profundamente pessoal.",
          "São histórias diferentes, que exigem abordagens criativas próprias, mas compartilham a necessidade de compreender seus protagonistas.",
        ],
      },
      {
        title: "Da pesquisa à construção da narrativa",
        paragraphs: [
          "Desenvolvemos conceitos criativos, estruturas narrativas, roteiros, tratamentos visuais e direcionamentos de produção.",
          "Nos documentários, buscamos identificar personagens, acontecimentos, conflitos, transformações e momentos que ajudem a construir uma narrativa envolvente.",
          "Em campanhas, trabalhamos para transformar os objetivos de comunicação em conceitos criativos que representem a identidade das marcas.",
          "Em shows e festivais, buscamos transmitir a dimensão dos acontecimentos, a energia dos artistas e a experiência do público.",
          "Nossa direção criativa acompanha as diferentes etapas de produção para preservar a identidade do projeto e garantir que a narrativa esteja presente nas escolhas visuais, sonoras e editoriais.",
        ],
      },
      {
        title: "Histórias que merecem ser sentidas",
        paragraphs: [
          "Durante a produção do documentário de Corina Godoy, passamos quatro dias revisitando sua trajetória, suas conquistas e os desafios enfrentados ao longo da vida.",
          "A relação de confiança construída durante as gravações permitiu que ela compartilhasse lembranças e emoções de maneira natural.",
          "É essa sensibilidade que buscamos levar para nossos projetos. Entender que, por trás de cada filme, existe uma pessoa que está confiando a nós algo importante.",
          "Para a Alastro, storytelling não é apenas uma técnica de comunicação. É a maneira como enxergamos o mundo e encontramos significado nas histórias que temos o privilégio de contar.",
        ],
      },
    ],
    seoTitle: "Direção Criativa e Storytelling para Marcas | Alastro",
    seoDescription:
      "Direção criativa e storytelling: conceito, roteiro e narrativa para documentários, campanhas, shows e festivais.",
    keywords: [
      "direção criativa",
      "storytelling",
      "roteiro",
      "narrativa audiovisual",
      "conceito criativo",
    ],
    related: [
      "producao-audiovisual",
      "branding",
      "conteudo-estrategico",
    ],
  },
  {
    slug: "planejamento-estrategico-crescimento",
    icon: Target,
    image: "/images/equipe-alastro.webp",
    media: ["guudrun-bts", "xama", "ironman-bts"],
    name: "Planejamento Estratégico de Crescimento",
    headline: "Grandes resultados começam com uma direção clara.",
    summary:
      "Diagnóstico, prioridades e plano de ação para estruturar o crescimento da marca.",
    intro: [
      "Crescer exige mais do que boas ideias. Exige compreender o momento do negócio, identificar oportunidades e construir um planejamento que conecte objetivos, recursos e execução.",
      "Na Alastro, unimos experiência em marketing, comunicação e desenvolvimento de projetos para ajudar marcas a estruturar suas estratégias de crescimento.",
      "Nossa abordagem considera o posicionamento da empresa, seus canais de comunicação, seus públicos e as oportunidades existentes em seu mercado.",
    ],
    sections: [
      {
        title: "Diagnóstico e definição de prioridades",
        paragraphs: [
          "Começamos analisando o cenário atual do negócio, seus objetivos e os principais desafios de comunicação e marketing.",
          "A partir desse diagnóstico, identificamos oportunidades, estabelecemos prioridades e desenvolvemos um plano de ação compatível com a realidade da empresa.",
          "O planejamento pode incluir posicionamento, presença digital, estratégias de conteúdo, campanhas, desenvolvimento de novos canais e integração entre equipes.",
        ],
      },
      {
        title: "Da estratégia à execução",
        paragraphs: [
          "Acreditamos que um planejamento só tem valor quando pode ser colocado em prática.",
          "Por isso, buscamos transformar objetivos em ações, com responsabilidades definidas, prioridades claras e indicadores que permitam acompanhar o desenvolvimento dos projetos.",
          "Nossa atuação pode envolver tanto o desenvolvimento da estratégia quanto o acompanhamento de sua execução, em colaboração com a equipe do cliente.",
        ],
      },
    ],
    seoTitle: "Planejamento Estratégico de Marketing e Crescimento | Alastro",
    seoDescription:
      "Planejamento estratégico de marketing e crescimento: diagnóstico, prioridades e plano de ação ligados à execução.",
    keywords: [
      "planejamento estratégico",
      "planejamento de marketing",
      "estratégia de crescimento",
      "diagnóstico de marketing",
    ],
    related: [
      "marketing-digital-performance",
      "consultoria-negocios-criadores",
      "branding",
    ],
  },
  {
    slug: "consultoria-negocios-criadores",
    icon: Handshake,
    image: "/images/capas/bastidores-corina.webp",
    media: ["ironman-bts", "viniday-bts", "doc-manu"],
    name: "Consultoria para Negócios e Criadores",
    headline:
      "Experiência, estratégia e criatividade para transformar ideias em projetos.",
    summary:
      "Consultoria de marketing e produção para empresas, empreendedores e criadores de conteúdo.",
    intro: [
      "A experiência acumulada ao longo de seis anos de Alastro, somada à trajetória de nosso fundador em marketing e empreendedorismo, nos permite compreender desafios que vão além da produção audiovisual.",
      "Conhecemos a realidade de construir uma marca, desenvolver processos, estruturar equipes, conquistar clientes e transformar ideias em projetos que exigem planejamento e responsabilidade.",
      "Nossa consultoria conecta essa experiência às necessidades de empresas, empreendedores e criadores de conteúdo que desejam desenvolver sua comunicação.",
    ],
    sections: [
      {
        title: "Consultoria para empresas",
        paragraphs: [
          "Trabalhamos com negócios que precisam organizar suas estratégias de marketing, fortalecer o posicionamento e desenvolver processos de produção e comunicação.",
          "Nossa atuação pode incluir diagnóstico, direcionamento estratégico, planejamento editorial, organização de operações audiovisuais e orientação para equipes internas.",
          "Buscamos soluções que respeitem a estrutura, os recursos e os objetivos de cada empresa.",
        ],
      },
      {
        title: "Consultoria para criadores de conteúdo",
        paragraphs: [
          "Apoiamos criadores que desejam profissionalizar sua comunicação, desenvolver projetos audiovisuais e estruturar uma produção de conteúdo mais consistente.",
          "O trabalho pode envolver posicionamento, formatos de conteúdo, planejamento, processos de gravação, organização de equipes e desenvolvimento de projetos especiais.",
          "Também oferecemos direcionamento para operações em que o próprio cliente realiza parte da captação, enquanto a Alastro participa da estratégia, orientação técnica e pós-produção.",
          "Nosso objetivo é compartilhar conhecimento, desenvolver autonomia e construir relações de parceria que contribuam para a evolução de cada projeto.",
        ],
      },
    ],
    seoTitle: "Consultoria de Marketing para Empresas e Criadores | Alastro",
    seoDescription:
      "Consultoria de marketing e produção de conteúdo para empresas, empreendedores e criadores que querem profissionalizar a comunicação.",
    keywords: [
      "consultoria de marketing",
      "consultoria para criadores de conteúdo",
      "consultoria para empresas",
      "profissionalizar produção de conteúdo",
    ],
    related: [
      "planejamento-estrategico-crescimento",
      "conteudo-estrategico",
      "producao-audiovisual",
    ],
  },
  {
    slug: "trafego-pago",
    icon: Megaphone,
    image: "/images/capas/bastidores-heber.webp",
    media: ["vinijr-jantar", "guudrun-sp", "xama", "guudrun-bts"],
    name: "Tráfego Pago",
    headline:
      "Campanhas que conectam criatividade, dados e objetivos de negócio.",
    summary:
      "Planejamento de mídia, criativos pensados para anúncios e otimização com base em dados.",
    intro: [
      "O tráfego pago permite ampliar o alcance das marcas, apresentar produtos e serviços a novos públicos e desenvolver campanhas direcionadas a diferentes objetivos.",
      "Na Alastro, conectamos o planejamento de mídia à estratégia de marketing e à produção criativa, desenvolvendo campanhas que consideram tanto a mensagem quanto os resultados esperados.",
    ],
    sections: [
      {
        title: "Planejamento de campanhas",
        paragraphs: [
          "Cada projeto começa pela compreensão do negócio, do público e dos objetivos da campanha.",
          "A partir dessas informações, definimos estratégias de mídia, públicos, formatos, orçamento e indicadores de acompanhamento.",
          "As campanhas podem ser direcionadas ao reconhecimento de marca, divulgação de produtos, geração de contatos ou conversões, de acordo com as necessidades de cada cliente.",
        ],
      },
      {
        title: "Criativos que fazem parte da estratégia",
        paragraphs: [
          "Um dos diferenciais da nossa estrutura é a integração entre a produção audiovisual e o planejamento das campanhas.",
          "Podemos desenvolver vídeos, fotografias e peças publicitárias pensadas especificamente para mídia paga, considerando as características dos canais, a mensagem e o comportamento do público.",
          "Essa integração permite criar diferentes versões de uma campanha, testar abordagens e aproveitar os aprendizados para orientar novas produções.",
        ],
      },
      {
        title: "Acompanhamento e otimização",
        paragraphs: [
          "Acompanhamos os indicadores relevantes para cada campanha, analisando o desempenho dos anúncios, os custos e os resultados obtidos.",
          "Essas informações orientam ajustes nos públicos, nas peças criativas e na distribuição dos investimentos, respeitando os objetivos e o orçamento de cada projeto.",
        ],
      },
    ],
    seoTitle: "Gestão de Tráfego Pago e Campanhas Digitais | Alastro",
    seoDescription:
      "Gestão de tráfego pago com planejamento de mídia, criativos feitos para anúncios e otimização baseada em dados.",
    keywords: [
      "tráfego pago",
      "gestão de tráfego",
      "mídia paga",
      "anúncios online",
      "campanhas digitais",
    ],
    related: [
      "marketing-digital-performance",
      "gestao-redes-sociais",
      "producao-audiovisual",
    ],
  },
];

export const getService = (slug: string): Service | undefined =>
  SERVICES.find((service) => service.slug === slug);

/** Serviços complementares, já resolvidos a partir de `related`. */
export const getRelatedServices = (service: Service): Service[] =>
  service.related
    .map(getService)
    .filter((related): related is Service => Boolean(related));

/**
 * Todos os outros serviços: os complementares primeiro, depois os demais
 * na ordem do arquivo. Alimenta o carrossel "Outras áreas de atuação".
 */
export const getOtherServices = (service: Service): Service[] => {
  const related = getRelatedServices(service);
  const relatedSlugs = new Set(related.map((item) => item.slug));
  const rest = SERVICES.filter(
    (item) => item.slug !== service.slug && !relatedSlugs.has(item.slug)
  );
  return [...related, ...rest];
};

// Em desenvolvimento, avisa se o rodapé (service-links.ts) saiu de sincronia.
if (process.env.NODE_ENV !== "production") {
  SERVICES.forEach((service, index) => {
    const link = SERVICE_LINKS[index];
    if (!link || link.slug !== service.slug || link.name !== service.name) {
      throw new Error(
        `service-links.ts fora de sincronia com services.ts no item ${index + 1} (${service.slug}).`
      );
    }
  });
}
