"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HeroHeader } from "./HeroHeader";
import { LoginForm } from "./LoginForm";
import { LoadingSpinner } from "./LoadingSpinner";

export function LandingContent() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once when status changes to authenticated
    if (status === "authenticated") {
      router.push("/movies");
    }
  }, [status, router]);

  const isLoading = status === "loading";
  const isUnauthenticated = status === "unauthenticated";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center shadow bg-black text-white font-sans">
      <div className="flex flex-col items-center gap-8 p-8 rounded-2xl shadow-xl shadow-black/30 bg-[#8fcf3c]/30">
        <HeroHeader />

        {isLoading && <LoadingSpinner />}

        {isUnauthenticated && <LoginForm callbackUrl="/movies" />}
      </div>
    </div>
  );
}
