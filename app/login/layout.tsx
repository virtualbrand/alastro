import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acessar o painel | Alastro",
  description: "Área restrita ao time da Alastro.",
  // Tela interna: fora do índice dos buscadores.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
