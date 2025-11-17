"use client";

import { signIn, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthService } from "@/api-client";
import type { LoginDto } from "@/api-client";

type EmailInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function EmailInput({ value, onChange }: EmailInputProps) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm text-gray-300">Email</span>
      <input
        name="email"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg px-3 py-2 border border-[#8fcf3c]/40 bg-[#151a16] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8fcf3c]/40"
        required
      />
    </label>
  );
}

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function PasswordInput({ value, onChange }: PasswordInputProps) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm text-gray-300">Password</span>
      <input
        name="password"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        className="w-full rounded-lg px-3 py-2 border border-[#8fcf3c]/40 bg-[#151a16] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8fcf3c]/40"
        required
      />
    </label>
  );
}

type SubmitButtonProps = {
  disabled: boolean;
  isLoading: boolean;
};

function SubmitButton({ disabled, isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full inline-flex items-center cursor-pointer justify-center rounded-lg bg-[#8fcf3c] px-4 py-2 text-[#151a16] font-semibold hover:bg-[#a6ff4d] transition disabled:opacity-60"
    >
      {isLoading ? "Signing in…" : "Sign in"}
    </button>
  );
}

type GoogleButtonProps = {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
};

function GoogleButton({ disabled, isLoading, onClick }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-[#111827] font-semibold hover:bg-gray-100 transition disabled:opacity-60"
    >
      {isLoading ? (
        "Signing in…"
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" className="inline-block">
            <path fill="#fbbc05" d="M43.6 20.5H42V20H24v8h11.3C34.9 31.5 30.1 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C33.9 5.5 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.5-.4-3.5z"/>
            <path fill="#ea4335" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C33.9 5.5 29.2 4 24 4 16.6 4 10.1 8.6 6.3 14.7z"/>
            <path fill="#34a853" d="M24 44c5.1 0 9.8-1.7 13.5-4.6l-6.2-5c-2 1.4-4.5 2.3-7.3 2.3-6.1 0-10.9-3.5-13-8.6l-6.6 5C7.9 38.9 15.5 44 24 44z"/>
            <path fill="#4285f4" d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.1-3.6 5.6-6.7 6.9l.1.1 6.2 5C39.7 38 48 31 48 24c0-1.3-.1-2.5-.4-3.5z"/>
          </svg>
          <span className="ml-2">Continue with Google</span>
        </>
      )}
    </button>
  );
}

type ErrorMessageProps = {
  message: string | null;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
      {message}
    </div>
  );
}

type LoginFormProps = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl = "/movies" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // First, validate credentials with the backend
      const payload: LoginDto = { email, password };
      const backendResponse = await AuthService.postApiAuthLogin(payload);

      if (!backendResponse || !backendResponse.token) {
        setError("Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Store token
      localStorage.setItem("authToken", backendResponse.token);

      // Then sign in with NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.ok) {
        // Wait a moment for session to be established
        window.location.href = callbackUrl;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setIsLoading(true);
    // Check configured providers first; if Google isn't configured on the server
    // provide a clear error message instead of doing nothing.
    (async () => {
      try {
        const providers = await getProviders();
        if (providers && providers["google"]) {
          await signIn("google", { callbackUrl });
        } else {
          setError(
            "Google SSO is not configured on the server. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local and restart the dev server."
          );
          setIsLoading(false);
          console.warn("Available providers:", providers);
        }
      } catch (e) {
        setError("Failed to start Google sign-in");
        setIsLoading(false);
        console.error(e);
      }
    })();
  };

  return (
    <div className="rounded-xl border border-[#8fcf3c]/20 bg-[#1a211a] p-4 space-y-3">
      <ErrorMessage message={error} />
      <form onSubmit={handleCredentialsSubmit} className="space-y-3">
        <EmailInput value={email} onChange={setEmail} />
        <PasswordInput value={password} onChange={setPassword} />
        <SubmitButton disabled={isLoading} isLoading={isLoading} />
      </form>
      <hr className="border-white/10" />
      <GoogleButton
        disabled={isLoading}
        isLoading={isLoading}
        onClick={handleGoogleClick}
      />
      <p className="text-xs text-gray-400 text-center">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}
