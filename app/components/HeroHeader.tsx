"use client";

import Image from "next/image";

export function HeroHeader() {
  return (
    <>
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
    </>
  );
}
