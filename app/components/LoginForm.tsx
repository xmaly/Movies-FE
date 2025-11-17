"use client";

import { signIn } from "next-auth/react";
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
      className="w-full cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-[#dff7be] px-4 py-2 text-[#151a16] font-semibold hover:bg-[#a6ff4d] transition disabled:opacity-60"
    >
      {isLoading ? "Signing in…" : "Continue with Google"}
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
    signIn("google", { callbackUrl });
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
