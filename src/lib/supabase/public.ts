import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de leitura pública, sem cookies.
 *
 * O cliente de `server.ts` lê cookies para resolver a sessão, e isso
 * força o Next a renderizar a rota sob demanda. Páginas públicas só
 * precisam do que a RLS libera para o papel anônimo, então usam este
 * cliente e continuam sendo geradas estaticamente com revalidação.
 */
export const createPublicClient = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
