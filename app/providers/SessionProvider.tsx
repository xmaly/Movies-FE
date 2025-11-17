"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { OpenAPI } from "@/api-client";

interface Props {
  children: ReactNode;
}

export default function NextAuthSessionProvider({ children }: Props) {
  useEffect(() => {
    // Configure OpenAPI base URL
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5013";
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
