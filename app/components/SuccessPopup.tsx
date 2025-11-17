"use client";

type SuccessPopupProps = {
  show: boolean;
};

export function SuccessPopup({ show }: SuccessPopupProps) {
  if (!show) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#8fcf3c] text-[#151a16] px-6 py-3 rounded-xl shadow-lg z-50 font-semibold text-lg transition-opacity animate-fade-in-out">
      Successfully logged in!
    </div>
  );
}
