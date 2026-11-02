import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Mantém o projeto Supabase ativo no plano gratuito, que pausa após
 * 7 dias sem atividade. Chamada diariamente pelo Vercel Cron (vercel.json).
 *
 * Precisa de uma consulta real ao banco: só bater na URL do projeto
 * não conta como atividade.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // A Vercel envia o CRON_SECRET no header; bloqueia chamadas externas.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { error } = await createPublicClient()
    .from("cases")
    .select("id")
    .limit(1);

  if (error) {
    console.error("[keep-alive] Falha ao consultar a Supabase:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
