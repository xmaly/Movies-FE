"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function GlobalLogoutButton() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const userEmail = session.user?.email ?? "(no email)";
  const userId = (session.user as any)?.id ?? "-";
  const accessToken = (session as any)?.accessToken as string | undefined;
  const tokenPreview = accessToken
    ? accessToken.length > 16
      ? `${accessToken.slice(0, 8)}...${accessToken.slice(-8)}`
      : accessToken
    : "-";

  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
      <div className="hidden sm:block bg-[#0f140f] border border-[#8fcf3c]/20 px-3 py-2 rounded-lg text-sm">
        <div className="text-[#8fcf3c] font-semibold">{userEmail}</div>
        <div className="text-xs text-gray-300">id: {userId}</div>
        <div className="text-xs text-gray-300">token: {tokenPreview}</div>
      </div>

      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Sign out
      </button>
    </div>
  );
}
