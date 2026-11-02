"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/services/authService";

export const SignOutButton = () => {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleSignOut = async () => {
    setIsLeaving(true);
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLeaving}
      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-bold uppercase text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {isLeaving ? "Saindo..." : "Sair"}
    </button>
  );
};
