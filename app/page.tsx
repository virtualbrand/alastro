import HomeShell from "@/components/HomeShell";
import { getSiteClients } from "@/lib/clients-queries";
import { getFeaturedCases } from "@/lib/cases-queries";

// Os destaques vêm do banco: gera estático e revalida em background.
export const revalidate = 60;

export default async function Home() {
  const [clients, brands, featuredCases, featuredBastidores] =
    await Promise.all([
      getSiteClients(["personalidade", "artista"]),
      getSiteClients(["marca"]),
      getFeaturedCases("case"),
      getFeaturedCases("bastidores"),
    ]);
  return (
    <HomeShell
      clients={clients}
      brands={brands}
      featuredCases={featuredCases}
      featuredBastidores={featuredBastidores}
    />
  );
}
