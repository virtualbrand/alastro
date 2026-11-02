"use client";

import { useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { AuthError, requestPasswordReset, signIn } from "@/services/authService";

interface LoginFormData {
  email: string;
  password: string;
}

interface RecoverFormData {
  email: string;
}

type View = "login" | "recover";

const EMAIL_PATTERN = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "E-mail inválido.",
};

interface AuthFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  register?: Record<string, unknown>;
  /** Slot para o botão de mostrar/ocultar senha. */
  trailing?: React.ReactNode;
}

/**
 * Campo com a borda que acompanha o mouse — mesma linguagem visual
 * usada no formulário de /trabalhe-conosco.
 */
const AuthField = ({
  label,
  type = "text",
  placeholder,
  autoComplete,
  error,
  register,
  trailing,
}: AuthFieldProps) => {
  const id = useId();
  const errorId = `${id}-error`;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="w-full relative">
      <label
        htmlFor={id}
        className="block mb-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-primary)]"
      >
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`relative z-10 border-2 border-[var(--color-border-form)] h-12 w-full rounded-md bg-[var(--color-surface)] px-4 outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] focus:border-[var(--color-accent-green)] placeholder:font-normal text-sm lg:text-base font-normal text-[var(--color-text-primary)] placeholder:text-[var(--color-border-form)] ${
            trailing ? "pr-12" : ""
          } ${error ? "border-red-400/70" : ""}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...register}
        />
        {trailing && (
          <div className="absolute right-1 top-0 z-20 flex h-12 w-10 items-center justify-center">
            {trailing}
          </div>
        )}
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-accent-green) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-accent-green) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

const SubmitButton = ({
  isSubmitting,
  idleLabel,
  busyLabel,
}: {
  isSubmitting: boolean;
  idleLabel: string;
  busyLabel: string;
}) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className="group/button relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-[var(--color-accent-green)] px-6 py-3 text-sm font-bold uppercase text-[var(--color-text-secondary)] transition-all duration-300 ease-in-out hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
  >
    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
    <span className="px-2 py-1 text-sm">
      {isSubmitting ? busyLabel : idleLabel}
    </span>
    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
      <div className="relative h-full w-8 bg-white/20" />
    </div>
  </button>
);

const FormAlert = ({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) => {
  const isError = tone === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-md border px-4 py-3 ${
        isError
          ? "border-red-400/40 bg-red-500/10"
          : "border-[var(--color-accent-green)]/40 bg-[var(--color-accent-green)]/10"
      }`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${
          isError ? "text-red-400" : "text-[var(--color-accent-green)]"
        }`}
      />
      <p
        className={`text-sm ${
          isError ? "text-red-200" : "text-[var(--color-text-primary)]"
        }`}
      >
        {children}
      </p>
    </div>
  );
};

/**
 * Só aceita caminho interno. Sem isso, `?redirectTo=https://site-malicioso`
 * transformaria o login num open redirect.
 */
const safeRedirect = (value: string | null, fallback: string): string => {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
};

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const [view, setView] = useState<View>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [recoverSent, setRecoverSent] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const loginForm = useForm<LoginFormData>({ mode: "onTouched" });
  const recoverForm = useForm<RecoverFormData>({ mode: "onTouched" });

  /** Troca de vista limpando o que pertencia à anterior. */
  const goTo = (next: View) => {
    setFormError(null);
    setRecoverSent(false);
    setIsSubmitting(false);
    if (next === "login") recoverForm.reset();
    else recoverForm.reset({ email: loginForm.getValues("email") ?? "" });
    setView(next);
  };

  const onLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const { redirectTo } = await signIn({
        email: data.email.trim(),
        password: data.password,
      });

      // Destino pedido pelo proxy ao barrar o acesso, se houver.
      const destination = safeRedirect(searchParams.get("redirectTo"), redirectTo);

      router.push(destination);
      // Sem o refresh, os server components seguem renderizando com a
      // sessão antiga em cache e o painel acha que ninguém entrou.
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof AuthError
          ? error.message
          : "Não foi possível entrar agora. Tente novamente em instantes."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRecover = async (data: RecoverFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      await requestPasswordReset(data.email.trim());
      setRecoverSent(true);
    } catch (error) {
      setFormError(
        error instanceof AuthError
          ? error.message
          : "Não foi possível enviar o link agora. Tente novamente em instantes."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Entra pelo lado para onde a navegação está indo; sem deslocamento
  // quando o sistema pede menos movimento.
  const shift = prefersReducedMotion ? 0 : 24;
  const transition = { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <div
      className="relative flex w-full flex-1 items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-12 sm:px-8 lg:w-1/2 lg:py-16"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Brilho que acompanha o cursor */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-200 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 236, 142, 0.20) 0%, transparent 90%)`,
        }}
      />

      <div className="relative z-20 w-full max-w-md font-amplitude">
        {/* Logo — a coluna visual fica oculta no mobile */}
        <div className="mb-8 lg:hidden">
          <img
            src="/images/logo.svg"
            alt="Alastro"
            className="h-9 w-auto brightness-0 invert"
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {view === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -shift }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -shift }}
              transition={transition}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold text-[var(--color-heading)] lg:text-4xl">
                Login
              </h1>

              {formError && <FormAlert tone="error">{formError}</FormAlert>}

              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                noValidate
                className="space-y-5"
              >
                <AuthField
                  label="E-mail"
                  type="email"
                  placeholder="seu@somosalastro.com"
                  autoComplete="email"
                  error={loginForm.formState.errors.email?.message}
                  register={loginForm.register("email", {
                    required: "Informe seu e-mail.",
                    pattern: EMAIL_PATTERN,
                  })}
                />

                <AuthField
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={loginForm.formState.errors.password?.message}
                  register={loginForm.register("password", {
                    required: "Informe sua senha.",
                  })}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="flex h-8 w-8 items-center justify-center rounded text-[var(--color-text-primary)] opacity-60 transition-all hover:text-[var(--color-accent-green)] hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-green)]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => goTo("recover")}
                    className="text-xs text-[var(--color-text-primary)] opacity-80 underline-offset-4 transition-all hover:text-[var(--color-accent-green)] hover:underline hover:opacity-100"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <SubmitButton
                  isSubmitting={isSubmitting}
                  idleLabel="Entrar"
                  busyLabel="Entrando..."
                />
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="recover"
              initial={{ opacity: 0, x: shift }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: shift }}
              transition={transition}
              className="space-y-8"
            >
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => goTo("login")}
                  className="group/back inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--color-text-primary)] opacity-70 transition-all hover:text-[var(--color-accent-green)] hover:opacity-100"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover/back:-translate-x-1" />
                  Voltar
                </button>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-[var(--color-heading)] lg:text-4xl">
                    Recuperar senha
                  </h1>
                  <p className="text-sm text-[var(--color-text-primary)] opacity-80">
                    Informe seu e-mail e enviaremos um link para você definir
                    uma nova senha.
                  </p>
                </div>
              </div>

              {formError && <FormAlert tone="error">{formError}</FormAlert>}

              {recoverSent ? (
                <FormAlert tone="success">
                  Se existir uma conta com esse e-mail, o link de recuperação
                  acabou de ser enviado. Verifique também a caixa de spam.
                </FormAlert>
              ) : (
                <form
                  onSubmit={recoverForm.handleSubmit(onRecover)}
                  noValidate
                  className="space-y-5"
                >
                  <AuthField
                    label="E-mail"
                    type="email"
                    placeholder="seu@somosalastro.com"
                    autoComplete="email"
                    error={recoverForm.formState.errors.email?.message}
                    register={recoverForm.register("email", {
                      required: "Informe seu e-mail.",
                      pattern: EMAIL_PATTERN,
                    })}
                  />

                  <SubmitButton
                    isSubmitting={isSubmitting}
                    idleLabel="Enviar link"
                    busyLabel="Enviando..."
                  />
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
