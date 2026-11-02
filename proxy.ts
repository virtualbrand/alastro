import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

export const proxy = (request: NextRequest) => updateSession(request);

export const config = {
  matcher: [
    /*
     * Roda em tudo, exceto arquivos estáticos e imagens — assim a sessão
     * é renovada nas navegações sem custo nos assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|images|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|webm|ico)$).*)",
  ],
};
