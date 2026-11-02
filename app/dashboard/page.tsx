import Link from "next/link";
import { FileSignature, FileText, FolderKanban, Users } from "lucide-react";

const SECTIONS = [
  {
    href: "/dashboard/cases",
    icon: FolderKanban,
    title: "Cases",
    description:
      "Cadastre os projetos da Alastro, publique a página de cada um e escolha quais aparecem em destaque na home.",
  },
  {
    href: "/dashboard/clientes",
    icon: Users,
    title: "Clientes",
    description:
      "Cadastre personalidades, artistas e marcas atendidos. Eles alimentarão a seção de clientes do site.",
  },
  {
    href: "/dashboard/blog",
    icon: FileText,
    title: "Blog",
    description:
      "Escreva artigos, organize por categorias e tags e publique em /blog.",
  },
  {
    href: "/dashboard/propostas",
    icon: FileSignature,
    title: "Propostas",
    description:
      "Monte propostas comerciais com entregáveis, opções de investimento e validade, e acompanhe a situação de cada uma.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Visão geral</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-md border border-border bg-card p-6 text-card-foreground transition-colors hover:border-[hsl(var(--primary-ink))]"
          >
            <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-[hsl(var(--primary-ink))]" />
            <h2 className="mt-4 text-lg font-bold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
