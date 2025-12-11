"use client";

import { Button } from "@/components/ui/button"
import { Instagram, Youtube } from "lucide-react"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"
import { usePathname } from "next/navigation"
import Link from "next/link"

function Footer() {
  const { handleAnchorClick } = useSmoothScroll();
  const pathname = usePathname();
  const isTrabalheConoscoPage = pathname === '/trabalhe-conosco';
  
  return (
    <footer className="bg-[var(--color-bg-2)] text-[var(--color-text-primary)] py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <a 
            href="/" 
            className="mb-8 rounded-full p-8 w-40 h-40 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src="/images/icon-footer.svg" alt="Logo Alastro" className="w-full h-full object-contain" />
          </a>
          <nav className="mb-8 flex flex-wrap justify-center gap-8">
            <a 
              href={isTrabalheConoscoPage ? "/#sobre" : "#sobre"}
              onClick={(e) => !isTrabalheConoscoPage && handleAnchorClick(e, "#sobre")}
              className="relative text-foreground hover:text-[var(--color-menu-hover)] transition-colors duration-200 text-base font-amplitude font-bold"
            >
              <span className="block">SOBRE NÓS</span>
            </a>
            <a 
              href={isTrabalheConoscoPage ? "/#portfolio" : "#portfolio"}
              onClick={(e) => !isTrabalheConoscoPage && handleAnchorClick(e, "#portfolio")}
              className="relative text-foreground hover:text-[var(--color-menu-hover)] transition-colors duration-200 text-base font-amplitude font-bold"
            >
              <span className="block">PORTFÓLIO</span>
            </a>
            <a 
              href="/trabalhe-conosco" 
              className="relative text-foreground hover:text-[var(--color-menu-hover)] transition-colors duration-200 text-base font-amplitude font-bold"
            >
              <span className="block">TRABALHE CONOSCO</span>
            </a>
            <a 
              href={isTrabalheConoscoPage ? "/#contato" : "#contato"}
              onClick={(e) => !isTrabalheConoscoPage && handleAnchorClick(e, "#contato")}
              className="relative text-foreground hover:text-[var(--color-menu-hover)] transition-colors duration-200 text-base font-amplitude font-bold"
            >
              <span className="block">CONTATO</span>
            </a>
          </nav>
          <div className="mb-8 flex space-x-4">
            <a 
              href="https://www.youtube.com/@AgenciaAlastro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-[var(--color-border)] bg-[var(--color-bg-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-text-secondary)] hover:text-[var(--color-bg-2)] transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </Button>
            </a>
            <a 
              href="https://wa.link/n8pv4d"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-[var(--color-border)] bg-[var(--color-bg-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-text-secondary)] hover:text-[var(--color-bg-2)] transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0 group"
              >
                <img src="/whatsapp-icon.svg" alt="WhatsApp" className="h-4 w-4 group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                <span className="sr-only">WhatsApp</span>
              </Button>
            </a>
            <a 
              href="https://www.instagram.com/somosalastro/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-[var(--color-border)] bg-[var(--color-bg-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-text-secondary)] hover:text-[var(--color-bg-2)] transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] leading-normal">
              Agência Alastro © {new Date().getFullYear()} – Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }