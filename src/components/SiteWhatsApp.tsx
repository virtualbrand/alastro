"use client";

import { usePathname } from "next/navigation";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

/** Áreas sem o botão: painel administrativo, login e propostas privadas. */
const HIDDEN_PREFIXES = ["/dashboard", "/login", "/proposta"];

const DEFAULT_MESSAGE = "Olá! Estou no site da Alastro e gostaria de mais informações";
const WEDDING_MESSAGE =
  "Olá! Estou no site da Alastro e gostaria de mais informações sobre Wedding";

/**
 * Botão flutuante de WhatsApp do site, montado uma vez no layout raiz: aparece em todas as
 * páginas públicas e não precisa ser repetido página a página.
 */
export default function SiteWhatsApp() {
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null;
  }

  const message = pathname.startsWith("/wedding") ? WEDDING_MESSAGE : DEFAULT_MESSAGE;
  return <FloatingWhatsApp message={message} />;
}
