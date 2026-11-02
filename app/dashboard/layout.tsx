import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { NotifyProvider } from "@/components/ui/notify";
import ThemeSwitch from "@/components/ui/theme-switch";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Painel | Alastro",
  description: "Área restrita ao time da Alastro.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * O provider de tema fica no escopo do painel de propósito. O site
   * público é sempre escuro por identidade de marca e usa os tokens
   * --color-*, que não têm variante clara.
   */
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="alastro-painel-tema"
    >
      <div className="painel min-h-screen bg-background font-amplitude text-foreground transition-colors">
        {/* Mesmos recuos laterais do site (header, hero e rodapé): ver ui/floating-nav.tsx */}
        <header className="border-b border-border">
          <div className="flex w-full flex-wrap items-center justify-between gap-4 py-5 px-6 md:px-12 lg:px-20 xl:px-24">
            <img
              src="/images/logo.svg"
              alt="Alastro"
              className="h-8 w-auto dark:brightness-0 dark:invert"
            />
            <div className="flex items-center gap-4">
              <ThemeSwitch />
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user?.email}
              </span>
              <SignOutButton />
            </div>
          </div>

          <div className="w-full pb-3 px-6 md:px-12 lg:px-20 xl:px-24">
            <DashboardNav />
          </div>
        </header>

        <NotifyProvider>
          <main className="w-full py-10 px-6 md:px-12 lg:px-20 xl:px-24">
            {children}
          </main>
        </NotifyProvider>
      </div>
    </ThemeProvider>
  );
}
