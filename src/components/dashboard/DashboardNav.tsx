"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileSignature,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    href: "/dashboard",
    label: "Visão geral",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/dashboard/cases", label: "Cases", icon: FolderKanban },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/blog", label: "Blog", icon: FileText },
  { href: "/dashboard/propostas", label: "Propostas", icon: FileSignature },
];

export const DashboardNav = () => {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap items-center gap-1"
      aria-label="Seções do painel"
    >
      {ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
