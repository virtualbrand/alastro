/**
 * Converte um link de YouTube ou Vimeo na URL de embed.
 * Devolve null quando não reconhece, para a página simplesmente não
 * renderizar o player em vez de montar um iframe para lugar nenhum.
 */
export const toEmbedUrl = (url: string | null): string | null => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const match = parsed.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return /^\d+$/.test(id ?? "") ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
};
