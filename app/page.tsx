"use client";

import NextAuthSessionProvider from "@/app/providers/SessionProvider";
import { LandingContent } from "./components/LandingContent";

export default function Home() {
  return (
    <NextAuthSessionProvider>
      <LandingContent />
    </NextAuthSessionProvider>
  );
}
