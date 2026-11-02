"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ThemeSwitch = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setChecked(resolvedTheme === "dark"), [resolvedTheme]);

  const handleCheckedChange = useCallback(
    (isChecked: boolean) => {
      setChecked(isChecked);
      setTheme(isChecked ? "dark" : "light");
    },
    [setTheme],
  );

  // O tema só é conhecido no cliente: renderizar antes disso causaria
  // divergência de hidratação. O espaço é reservado para o layout não pular.
  if (!mounted) return <div className={cn("h-7 w-16", className)} aria-hidden />;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center", // center the whole control
        "h-7 w-16", // track sized to hug the icons
        className
      )}
      {...props}
    >
      {/* The real shadcn Switch (full-size, same structure) */}
      <Switch
        checked={checked}
        onCheckedChange={handleCheckedChange}
        aria-label="Alternar entre tema claro e escuro"
        className={cn(
          // root (track)
          "peer absolute inset-0 h-full w-full rounded-full bg-input/50",
          "transition-colors [transition-duration:300ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // tune the default thumb size & z-index so it slides over icons
          "[&>span]:h-5 [&>span]:w-5 [&>span]:rounded-full [&>span]:bg-background [&>span]:shadow [&>span]:z-10",
          // O Switch base desliza em 150ms, que fica seco. 400ms com
          // desaceleracao forte (easeOutQuint) dá o deslize suave.
          // Propriedade arbitrária em vez dos utilitários de duração e
          // easing com valor arbitrário: o plugin tailwindcss-animate
          // registra esses mesmos prefixos para animation, a classe vira
          // ambígua e o Tailwind a descarta silenciosamente.
          "[&>span]:transition-transform [&>span]:[transition-duration:400ms]",
          "[&>span]:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          // folga de 4px nas duas pontas: repouso em 4, fim em w-16(64) - thumb(20) - 4
          "data-[state=unchecked]:[&>span]:translate-x-1",
          "data-[state=checked]:[&>span]:translate-x-[40px]"
        )}
      />

      {/* Icons overlaid inside the track, perfectly centered left/right */}
      <span
        className={cn(
          "pointer-events-none absolute left-1.5 inset-y-0 z-0",
          "flex items-center justify-center"
        )}
      >
        <SunIcon
          size={14}
          className={cn(
            "transition-all [transition-duration:400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            checked ? "text-muted-foreground/70" : "text-foreground scale-110"
          )}
        />
      </span>

      <span
        className={cn(
          "pointer-events-none absolute right-1.5 inset-y-0 z-0",
          "flex items-center justify-center"
        )}
      >
        <MoonIcon
          size={14}
          className={cn(
            "transition-all [transition-duration:400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            checked ? "text-foreground scale-110" : "text-muted-foreground/70"
          )}
        />
      </span>
    </div>
  );
};

export default ThemeSwitch;
