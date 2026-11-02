"use client";

import { describeDbError } from "@/lib/db-errors";
import { createClient } from "@/lib/supabase/client";

export class PreferenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PreferenceError";
  }
}

/** Grava a preferência do usuário logado (a RLS garante que é só a dele). */
export const setUserPreference = async (
  key: string,
  value: unknown,
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_preferences")
    .upsert({ key, value }, { onConflict: "user_id,key" });

  if (error) {
    console.error("[preferences]", error.code, error.message);
    throw new PreferenceError(describeDbError(error));
  }
};
