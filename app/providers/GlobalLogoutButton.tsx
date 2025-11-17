"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function GlobalLogoutButton() {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!session) {
    return null;
  }

  const userEmail = session.user?.email ?? "(no email)";
  const userId = (session.user as any)?.id ?? "-";
  const userName = session.user?.name ?? "-";
  const accessToken = (session as any)?.accessToken as string | undefined;
  const tokenPreview = accessToken
    ? accessToken.length > 16
      ? `${accessToken.slice(0, 8)}...${accessToken.slice(-8)}`
      : accessToken
    : "-";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-3 z-50">
      <div
        className="hidden sm:block bg-[#0f140f] border border-[#8fcf3c]/20 px-4 py-3 rounded-lg text-sm cursor-pointer hover:border-[#8fcf3c]/40 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          <div className="space-y-1">
            <div className="text-[#8fcf3c] font-semibold">{userEmail}</div>
            <div className="text-xs text-gray-400">Click to expand</div>
          </div>
        ) : (
          <div className="space-y-2 min-w-[300px]">
            <div className="text-[#8fcf3c] font-semibold text-base">{userEmail}</div>
            
            <div className="border-t border-[#8fcf3c]/20 pt-2">
              <div className="text-xs text-gray-400 mb-1">User Name</div>
              <div className="text-xs text-gray-200 font-mono break-all">{userName}</div>
            </div>

            <div className="border-t border-[#8fcf3c]/20 pt-2">
              <div className="text-xs text-gray-400 mb-1">User ID</div>
              <div className="text-xs text-gray-200 font-mono flex items-center justify-between">
                <span>{userId}</span>
                {userId !== "-" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(userId);
                    }}
                    className="text-[#8fcf3c] hover:text-[#a6ff4d] text-xs ml-2"
                  >
                    copy
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-[#8fcf3c]/20 pt-2">
              <div className="text-xs text-gray-400 mb-1">Access Token</div>
              <div className="text-xs text-gray-200 font-mono break-all">{tokenPreview}</div>
              {accessToken && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(accessToken);
                  }}
                  className="text-[#8fcf3c] hover:text-[#a6ff4d] text-xs mt-1"
                >
                  copy full token
                </button>
              )}
            </div>

            <div className="border-t border-[#8fcf3c]/20 pt-2">
              <div className="text-xs text-gray-400 mb-1">Provider</div>
              <div className="text-xs text-gray-200">{session.user?.image ? "google" : "credentials"}</div>
            </div>
          </div>
        )}
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
