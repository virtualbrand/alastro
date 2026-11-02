/**
 * Vídeos curtos (em loop, sem som) usados como mockup nas seções de /servicos/[slug].
 *
 * São os mesmos clips dos cases da home ("Nossos trabalhos em ação" e "Por trás das
 * câmeras"), só os leves (todos abaixo de 1,6 MB em webm): cada página de serviço carrega
 * até cinco ao rolar. Os clips pesados (documentário da Corina, do casamento e 99Food,
 * de 5 a 23 MB) ficaram de fora de propósito.
 */
export interface ServiceMediaClip {
  webm: string;
  mp4: string;
}

const clip = (path: string): ServiceMediaClip => ({
  webm: `/videos/${path}.webm`,
  mp4: `/videos/${path}.mp4`,
});

export const SERVICE_MEDIA = {
  "doc-manu": clip("trabalhos/documentario-manu-cit-ironman"),
  xama: clip("trabalhos/documentario-xama"),
  "vinijr-jantar": clip("trabalhos/instituto-vini-jr-jantar"),
  "guudrun-sp": clip("trabalhos/tributo-sp-guudrun"),
  "ironman-bts": clip("bastidores/bastidores-alastro-manu-cit-ironman"),
  "viniday-bts": clip("bastidores/bastidores-alastro-viniday"),
  "guudrun-bts": clip("bastidores/bastidores-alastro-guudrun"),
} as const;

export type ServiceMediaKey = keyof typeof SERVICE_MEDIA;
