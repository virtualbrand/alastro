import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-text-primary)] py-16 font-['Geist',sans-serif]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-primary/10 p-8">
            <Icons.logo className="w-8 h-8 text-primary" />
          </div>
          <nav className="mb-8 flex flex-wrap justify-center gap-8">
            <a href="#sobre" className="hover:text-primary transition-colors text-[var(--color-text-primary)] font-medium">
              SOBRE NÓS
            </a>
            <a href="#portfolio" className="hover:text-primary transition-colors text-[var(--color-text-primary)] font-medium">
              PORTFÓLIO
            </a>
            <a href="#trabalhe" className="hover:text-primary transition-colors text-[var(--color-text-primary)] font-medium">
              TRABALHE CONOSCO
            </a>
            <a href="#contato" className="hover:text-primary transition-colors text-[var(--color-text-primary)] font-medium">
              CONTATO
            </a>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
          <div className="mb-8 w-full max-w-md">
            <form className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input 
                  id="email" 
                  placeholder="Digite seu email" 
                  type="email" 
                  className="rounded-full bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]" 
                />
              </div>
              <Button 
                type="submit" 
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
              >
                Inscrever-se
              </Button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              © 2024 Nossa Empresa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }