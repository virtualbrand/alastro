/**
 * Conteúdo institucional fixo, igual em toda proposta.
 *
 * Extraído das propostas Grupo Zit e Hostel da Vila + Albatroz. Fica aqui
 * em vez de virar campo no painel: redigitar o mesmo texto a cada proposta
 * só abriria espaço para divergência entre documentos.
 */

export const ALASTRO_TAGLINE = "produtora audiovisual · rio de janeiro, brasil";

export const ALASTRO_ABOUT = [
  "Somos uma produtora audiovisual apaixonada pelo poder das imagens em movimento.",
  "Ao longo dos anos, conquistamos a confiança de clientes de diversos setores, trabalhando em projetos que vão desde comerciais e vídeos corporativos até produções cinematográficas e conteúdo para redes sociais.",
];

export interface ClientGroup {
  label: string;
  names: string[];
}

export const ALASTRO_CLIENTS: ClientGroup[] = [
  {
    label: "Personalidades",
    names: [
      "Vini Jr",
      "Felipe Neto",
      "Manu Cit",
      "Gabriela Prioli",
      "Bia Ben",
      "Paulinho",
    ],
  },
  {
    label: "Artistas",
    names: [
      "Xamã",
      "Veigh",
      "Gabriel O Pensador",
      "Maria Gadú",
      "Manu Caiado",
      "Natalia Guitler",
    ],
  },
  {
    label: "Marcas",
    names: ["G4", "Gocase", "Guudrun", "Amaze", "Bold", "Dux"],
  },
];
