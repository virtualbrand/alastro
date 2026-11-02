/** Formato de erro que o supabase-js devolve em `error`. */
export interface PostgrestLikeError {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
}

/**
 * Traduz um erro do banco numa frase que o usuário do painel entenda e saiba
 * o que fazer. Nunca repassa a mensagem técnica: o detalhe (código, coluna,
 * tabela) vai só para o console, quem chama deve registrá-lo antes.
 *
 * `duplicate` é a mensagem de quando a URL (slug) já existe, que muda por recurso.
 */
export const describeDbError = (
  error: PostgrestLikeError,
  { duplicate }: { duplicate?: string } = {},
): string => {
  const message = error.message.toLowerCase();

  if (
    error.code === "23505" ||
    (message.includes("duplicate key") && message.includes("slug"))
  ) {
    return (
      duplicate ??
      "Já existe um registro com esses dados. Altere o que se repete e tente de novo."
    );
  }

  if (message.includes("featured_limit")) {
    return "Essa categoria já tem o máximo de 6 destaques. Remova um destaque dela antes de destacar outro case.";
  }

  // Coluna ou tabela que o painel espera e o banco ainda não tem (migration pendente).
  if (
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    error.code === "42703" ||
    error.code === "42P01" ||
    error.code === "PGRST200" ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  ) {
    return "O banco de dados ainda não foi atualizado para esta versão do painel. Avise o time técnico para aplicar as atualizações pendentes; nada do que você preencheu foi salvo.";
  }

  if (error.code === "42501" || message.includes("permission denied")) {
    return "O banco recusou o acesso. Avise o time técnico para revisar as permissões.";
  }
  if (message.includes("row-level security") || message.includes("jwt")) {
    return "Sua sessão expirou ou você não tem permissão para esta ação. Entre novamente e tente de novo.";
  }
  if (error.code === "23503") {
    return "Este item está ligado a outro registro e não pode ser alterado ou excluído agora.";
  }
  if (error.code === "23502") {
    return "Há um campo obrigatório sem preencher.";
  }
  if (error.code === "23514") {
    return "Algum campo tem um valor que não é permitido.";
  }
  if (message.includes("fetch") || message.includes("network")) {
    return "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.";
  }

  return "Algo deu errado e não foi possível concluir a ação. Tente de novo; se continuar, avise o time técnico.";
};
