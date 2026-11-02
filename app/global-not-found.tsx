import "@/globals.css";
import Link from "next/link";

/**
 * 404 de rotas inexistentes. Fica fora do layout raiz de propósito: não monta
 * os provedores, scripts e o botão de WhatsApp só para mostrar uma mensagem.
 */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] font-sans text-[var(--color-text-primary)]">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl">Ops! Página não encontrada</p>
          <Link href="/" className="underline">
            Voltar ao Início
          </Link>
        </div>
      </body>
    </html>
  );
}
