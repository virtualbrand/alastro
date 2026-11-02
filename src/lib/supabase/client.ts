import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no navegador (client components).
 * A chave publicável é exposta de propósito — quem protege os dados é a RLS.
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
