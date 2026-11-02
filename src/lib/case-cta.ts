/** Une itens em português: "A", "A e B", "A, B e C". */
export const joinList = (items: string[]): string => {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
};

/** Os nomes dos clientes vêm juntos em `case.client`, separados por " · ". */
export const splitClients = (client: string | null): string[] =>
  (client ?? "")
    .split("·")
    .map((name) => name.trim())
    .filter(Boolean);

/**
 * Texto da chamada do fim de um case, montado com cliente e serviços do projeto.
 *
 * Não usa artigo nem pronome para o cliente ("com Xamã", "como o de Manu Cit"): assim não é
 * preciso saber o gênero de ninguém, e nomes artísticos funcionam como qualquer outro. O "o de"
 * concorda com "projeto", não com a pessoa. Os serviços vão entre aspas porque alguns nomes
 * têm "e" dentro ("Direção Criativa e Storytelling"), o que confundiria a lista.
 */
export const buildCaseCta = ({
  client,
  services,
}: {
  client: string | null;
  services: string[];
}): { heading: string; text: string } => {
  const clients = splitClients(client);
  const names = joinList(clients);

  const heading = names
    ? `Quer um projeto como o de ${names}?`
    : "Quer um projeto como este?";

  const quoted = joinList(services.map((service) => `“${service}”`));
  const delivered = quoted
    ? `Neste projeto, a Alastro cuidou de ${quoted}.`
    : "Neste projeto, a Alastro cuidou de todas as etapas, do roteiro à entrega final.";

  return {
    heading,
    text: `${delivered} Conte para a gente o que você quer construir e vamos desenhar a sua história do mesmo jeito.`,
  };
};
