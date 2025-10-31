"use client";

import Image from "next/image";
import { signIn, useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextAuthSessionProvider from "@/app/providers/SessionProvider";
import {LoginDto, LoginService} from "@/api-client";
import {router} from "next/client";

export default function Home() {
  return (
    <NextAuthSessionProvider>
      <LandingContent />
    </NextAuthSessionProvider>
  );
}

type LoginFormProps = {
  callbackUrl?: string;
};

function LoginForm({ callbackUrl = "/" }: LoginFormProps) {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const onGoogleClick = async () => {
        try {
          setBusy(true);
          await signIn("google", { callbackUrl });
        } finally {
          setBusy(false);
        }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: LoginDto = { email, password };

        try {
            await LoginService.postApiLogin(payload);
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
                // You can also pass callbackUrl and then router.push it below
            });

            if (res?.error) {
                setError(res.error);
                return;
            }

            router.push('/movies');
        } catch (err: unknown) {
            const message =
                // @ts-expect-error — generated client may shape errors with `body`
                err?.body?.message ||
                // @ts-expect-error — alternative error field
                err?.body?.error ||
                (err instanceof Error ? err.message : 'Request failed.');
            setError(String(message));
        } finally {
            setLoading(false);
        }
    };


    if (status === "loading") {
    return (
      <div className="rounded-xl border border-[#8fcf3c]/20 bg-[#1a211a] p-4 animate-pulse">
        <div className="h-5 w-1/3 bg-gray-700 rounded mb-3" />
        <div className="h-10 w-full bg-gray-800 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#8fcf3c]/20 bg-[#1a211a] p-4 space-y-3">

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block space-y-1">
          <span className="block text-sm text-gray-300">Email</span>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg px-3 py-2 border border-[#8fcf3c]/40 bg-[#151a16] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8fcf3c]/40"
          />
        </label>

        <label className="block space-y-1">
          <span className="block text-sm text-gray-300">Password</span>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg px-3 py-2 border border-[#8fcf3c]/40 bg-[#151a16] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8fcf3c]/40"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center cursor-pointer justify-center rounded-lg bg-[#8fcf3c] px-4 py-2 text-[#151a16] font-semibold hover:bg-[#a6ff4d] transition disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <hr className="border-white/10" />

      <button
        onClick={onGoogleClick}
        disabled={busy}
        className="w-full cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#dff7be] px-4 py-2 text-[#151a16] font-semibold hover:bg-[#a6ff4d] transition disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Continue with Google"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}

function LandingContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        router.push("/movies");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center shadow bg-black text-white font-sans">
      {showPopup && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#8fcf3c] text-[#151a16] px-6 py-3 rounded-xl shadow-lg z-50 font-semibold text-lg transition-opacity animate-fade-in-out">
          Successfully logged in!
        </div>
      )}
      <div className="flex flex-col items-center gap-8 p-8 rounded-2xl shadow-xl shadow-black/30 bg-[#8fcf3c]/30">
        <Image
          src="/logo.png"
          alt="Movie Critics Logo"
          width={180}
          height={180}
        />
        <h1 className="text-4xl font-bold text-[#8fcf3c] drop-shadow text-center">
          Movie Critics
        </h1> 
        <p className="text-lg text-[#e6f9d5] text-center max-w-xl">
          Discover, review, and discuss the latest movies with fellow film lovers.
        </p>
        {status === "loading" && (
          <div className="flex items-center justify-center h-16">
            <svg
              className="animate-spin h-8 w-8 text-[#8fcf3c]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>
        )}
        {!session && status !== "loading" && (
          <LoginForm callbackUrl="/movies"/>
        )}
      </div>
    </div>
  );
}