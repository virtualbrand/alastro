import { Button } from "@/components/ui/button"
import { Instagram, Youtube } from "lucide-react"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"
import { useLocation } from "react-router-dom"

function Footer() {
  const { handleAnchorClick } = useSmoothScroll();
  const location = useLocation();
  const isTrabalheConoscoPage = location.pathname === '/trabalhe-conosco';
  
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
              className="hover:text-[var(--color-menu-hover)] transition-colors text-[var(--color-text-secondary)] font-amplitude font-medium"
            >
              SOBRE NÓS
            </a>
            <a 
              href={isTrabalheConoscoPage ? "/#portfolio" : "#portfolio"}
              onClick={(e) => !isTrabalheConoscoPage && handleAnchorClick(e, "#portfolio")}
              className="hover:text-[var(--color-menu-hover)] transition-colors text-[var(--color-text-secondary)] font-amplitude font-medium"
            >
              PORTFÓLIO
            </a>
            <a 
              href="/trabalhe-conosco" 
              className="hover:text-[var(--color-menu-hover)] transition-colors text-[var(--color-text-secondary)] font-amplitude font-medium"
            >
              TRABALHE CONOSCO
            </a>
            <a 
              href={isTrabalheConoscoPage ? "/#contato" : "#contato"}
              onClick={(e) => !isTrabalheConoscoPage && handleAnchorClick(e, "#contato")}
              className="hover:text-[var(--color-menu-hover)] transition-colors text-[var(--color-text-secondary)] font-amplitude font-medium"
            >
              CONTATO
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