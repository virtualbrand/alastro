import { createClient } from "@/lib/supabase/client";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResult {
  /** Para onde redirecionar após o login. */
  redirectTo: string;
}

/** Erro de autenticação com mensagem já pronta para exibição ao usuário. */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Traduz o erro da Supabase para uma mensagem em português.
 *
 * Credencial inválida e usuário inexistente recebem a MESMA resposta de
 * propósito: distinguir as duas revelaria quais e-mails têm conta.
 */
const describeError = (message: string): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Esta conta ainda não foi confirmada. Verifique seu e-mail.";
  }
  if (
    normalized.includes("too many requests") ||
    normalized.includes("rate limit")
  ) {
    return "Muitas tentativas seguidas. Aguarde um instante e tente de novo.";
  }
  return "Não foi possível entrar agora. Tente novamente em instantes.";
};

export const signIn = async ({
  email,
  password,
}: SignInCredentials): Promise<SignInResult> => {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new AuthError(describeError(error.message));
  }

  return { redirectTo: "/dashboard" };
};

/**
 * Dispara o e-mail de recuperação de senha.
 *
 * Não distingue e-mail cadastrado de inexistente: a Supabase responde
 * sucesso nos dois casos, de propósito. Diferenciar permitiria descobrir
 * quais endereços têm conta.
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const supabase = createClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/login/nova-senha`,
  });

  if (error) {
    const normalized = error.message.toLowerCase();
    if (normalized.includes("rate limit") || normalized.includes("too many")) {
      throw new AuthError(
        "Muitos pedidos seguidos. Aguarde alguns minutos antes de tentar de novo.",
      );
    }
    throw new AuthError(
      "Não foi possível enviar o link agora. Tente novamente em instantes.",
    );
  }
};

/** Encerra a sessão e devolve o usuário para o login. */
export const signOut = async (): Promise<void> => {
  const supabase = createClient();
  await supabase.auth.signOut();
};
