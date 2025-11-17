"use client";

export function HeroHeader() {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="180" height="180">
        {/* Black background circle */}
        <circle cx="100" cy="100" r="90" fill="#000"/>
        <circle cx="100" cy="100" r="90" fill="none" stroke="#8fcf3c" strokeWidth="2"/>
        
        {/* Star */}
        <polygon points="100,40 125,85 175,85 135,125 160,170 100,130 40,170 65,125 25,85 75,85" fill="#8fcf3c"/>
      </svg>
      <h1 className="text-4xl font-bold text-[#8fcf3c] drop-shadow text-center">
        Movie Critics
      </h1>
      <p className="text-lg text-[#e6f9d5] text-center max-w-xl">
        Discover, review, and discuss the latest movies with fellow film lovers.
      </p>
    </>
  );
}
