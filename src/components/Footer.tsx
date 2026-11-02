"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Instagram, Youtube } from "lucide-react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SERVICE_LINKS } from "@/content/service-links";

const SITE_LINKS = [
  { name: "Sobre nós", href: "/#sobre" },
  { name: "Cases", href: "/cases" },
  { name: "Blog", href: "/blog" },
  { name: "Trabalhe conosco", href: "/trabalhe-conosco" },
  { name: "Contato", href: "/#contato" },
];

const SOCIAL_LINKS = [
  { name: "YouTube", href: "https://www.youtube.com/@ProdutoraAlastro", icon: <Youtube className="h-4 w-4" /> },
  { name: "Instagram", href: "https://www.instagram.com/somosalastro/", icon: <Instagram className="h-4 w-4" /> },
];

/**
 * Fade-in do rodapé. O padrão do site (termina em "top 65%") não serve aqui:
 * o rodapé fica no fim da página e seus blocos nunca chegam tão alto na tela.
 * Estes valores fazem cada bloco terminar de aparecer quando sua base chega
 * à base da tela, o que sempre acontece ao rolar até o fim.
 */
const fadeProps = {
  "data-fade-start": "top 100%",
  "data-fade-end": "bottom bottom",
  suppressHydrationWarning: true,
} as const;

const linkClass =
  "inline-flex min-h-10 items-center sm:min-h-8 text-sm text-foreground transition-colors duration-200 hover:text-[var(--color-menu-hover)] sm:text-base";

const headingClass =
  "mb-4 text-xl font-bold leading-snug text-foreground";

function Footer() {
  const pathname = usePathname();
  const { scrollToElement } = useSmoothScroll();
  // Ativa o .fade-in dos blocos do rodapé também nas páginas sem seções animadas.
  useScrollAnimation();

  // Na home os links de seção rolam suavemente; nas outras páginas navegam para "/#seção".
  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === "/" && href.startsWith("/#")) {
      event.preventDefault();
      scrollToElement(href.slice(2));
    }
  };

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="bg-[var(--color-bg-2)] font-amplitude text-foreground">
      <div className="w-full px-6 pb-0 pt-16 md:px-12 md:pt-20 lg:px-20 xl:px-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Marca e contato */}
          <div className="fade-in space-y-8 lg:col-span-4" {...fadeProps}>
            <div className="space-y-5">
              {/* O ícone vira uma seta para cima no hover/foco: a seta fica dentro do próprio quadrado. O raio (17,82%) é o do SVG (rx 90 de 505), para a borda não mudar na troca. */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Voltar ao topo"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-[17.82%] bg-[#2c333a] outline-none"
              >
                <img
                  src="/images/icon-footer.svg"
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                {/*
                  A seta entra por cima do logo, num painel opaco com o mesmo grafite. O logo
                  fica parado por baixo: com os dois esmaecendo ao mesmo tempo, no meio da
                  transição o quadrado "piscava" mais escuro.
                */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center rounded-[17.82%] bg-[#2c333a] opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <ArrowUp strokeWidth={2.5} className="h-5 w-5 text-[var(--color-accent-green)]" />
                </span>
              </button>
              <p className="max-w-sm text-sm leading-relaxed sm:text-base">
                Produtora audiovisual brasileira que une estratégia, criatividade e produção para contar histórias que conectam e impactam.
              </p>
            </div>
            <ul className="flex gap-3" aria-label="Redes sociais">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-foreground text-foreground outline-none transition-all duration-300 hover:bg-foreground hover:text-[var(--color-bg-2)]"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navegação do site */}
          <nav aria-labelledby="footer-site" className="fade-in lg:col-span-3" {...fadeProps}>
            <h2 id="footer-site" className={headingClass}>
              A Alastro
            </h2>
            <ul>
              {SITE_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={(event) => handleSectionClick(event, link.href)}
                    className={linkClass}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Serviços: um link por página, com o nome do serviço como âncora */}
          <nav aria-labelledby="footer-services" className="fade-in lg:col-span-5" {...fadeProps}>
            <h2 id="footer-services" className={headingClass}>
              Serviços
            </h2>
            <ul className="sm:columns-2 sm:gap-x-8 lg:columns-1 xl:columns-2">
              {SERVICE_LINKS.map((service) => (
                <li key={service.slug} className="break-inside-avoid">
                  <Link href={`/servicos/${service.slug}`} className={linkClass}>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/*
          Marca em tamanho grande, inteira (411:131 é a proporção do SVG), dissolvida
          no pé do rodapé por uma máscara de gradiente. É decorativa (aria-hidden): o nome da marca já
          está no logo e no texto do rodapé.
        */}
        <div
          aria-hidden="true"
          className="fade-in pointer-events-none mt-10 aspect-[411/131] w-full select-none overflow-hidden md:mt-14"
          {...fadeProps}
          style={{
            maskImage: "linear-gradient(to bottom, #000 0%, #000 30%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 30%, transparent 100%)",
          }}
        >
          <img
            src="/images/logo.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="block w-full opacity-[0.16]"
          />
        </div>

        <p className="fade-in pb-8 pt-2 text-center text-sm text-foreground/70" {...fadeProps}>
          © {new Date().getFullYear()} Alastro. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export { Footer };
