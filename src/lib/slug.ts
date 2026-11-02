/**
 * Converte um título em slug: minúsculas, sem acento, hífens no lugar
 * de qualquer sequência não alfanumérica.
 *
 * Com `keepTrailingHyphen`, o hífen final é preservado: serve para campos
 * editados à mão, onde o hífen digitado precisa sobreviver até a próxima letra.
 */
export const slugify = (
  value: string,
  { keepTrailingHyphen = false }: { keepTrailingHyphen?: boolean } = {},
): string => {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 80);

  return keepTrailingHyphen ? slug : slug.replace(/-+$/, "");
};
