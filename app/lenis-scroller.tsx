"use client";

import { useLenis } from "@/hooks/useLenis";
import { useEffect } from "react";

export default function LenisScroller({ children }: { children: React.ReactNode }) {
  useLenis();
  
  return <>{children}</>;
}
