import DOMPurify from "isomorphic-dompurify";

/**
 * Limpa o HTML vindo do editor antes de injetar na página.
 *
 * O conteúdo é escrito por gente autenticada, mas uma conta comprometida
 * conseguiria gravar script no banco e ele executaria em todo visitante.
 * Sanitizar na renderização fecha esse caminho.
 */
export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "s", "code", "pre",
      "h2", "h3", "h4",
      "ul", "ol", "li",
      "blockquote",
      "a", "img",
      "figure", "figcaption", "hr",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "class"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/)/i,
  });
