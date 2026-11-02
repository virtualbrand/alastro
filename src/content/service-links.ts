/**
 * Slug e nome de cada serviço, sem o conteúdo das páginas.
 *
 * Existe separado de services.ts para o rodapé, que entra em quase todas as
 * páginas, não carregar no bundle todos os textos dos serviços. A ordem é a
 * de apresentação. services.ts confere em desenvolvimento se os dois arquivos
 * continuam iguais.
 */
export const SERVICE_LINKS = [
  { slug: "producao-audiovisual", name: "Produção Audiovisual de Alto Impacto" },
  { slug: "conteudo-estrategico", name: "Conteúdo Estratégico" },
  { slug: "gestao-redes-sociais", name: "Gestão e Inteligência de Redes Sociais" },
  { slug: "branding", name: "Branding e Construção de Marca" },
  { slug: "marketing-digital-performance", name: "Marketing Digital e Performance" },
  { slug: "direcao-criativa-storytelling", name: "Direção Criativa e Storytelling" },
  { slug: "planejamento-estrategico-crescimento", name: "Planejamento Estratégico de Crescimento" },
  { slug: "consultoria-negocios-criadores", name: "Consultoria para Negócios e Criadores" },
  { slug: "trafego-pago", name: "Tráfego Pago" },
] as const;
