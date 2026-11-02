import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Sem href = página atual. */
  href?: string;
}

/**
 * Breadcrumb visível. A cor vem de `className` (herdada via currentColor), para servir tanto
 * em fundo claro quanto escuro. Deve espelhar o BreadcrumbList do JSON-LD da página.
 */
export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-amplitude font-bold uppercase tracking-wide"
        )}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            {index > 0 && (
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              </li>
            )}
            {item.href ? (
              <li>
                <Link href={item.href} className="opacity-70 transition-opacity hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ) : (
              <li aria-current="page">{item.label}</li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
