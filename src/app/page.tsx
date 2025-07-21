"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CategoryTabs = dynamic(
  () =>
    import("@/widgets/category-tabs/CategoryTabs").then(
      (mod) => mod.CategoryTabs
    ),
  { ssr: false }
);
const ProductBattle = dynamic(
  () =>
    import("@/widgets/product-battle/ProductBattle").then(
      (mod) => mod.ProductBattle
    ),
  { ssr: false }
);
const FinalChoice = dynamic(
  () =>
    import("@/widgets/final-choice/FinalChoice").then((mod) => mod.FinalChoice),
  { ssr: false }
);

export default function Home() {
  const [step, setStep] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");
    setStep(stepParam);
  }, []);

  if (step === "category") {
    return <CategoryTabs />;
  }
  if (step === "battle") {
    return <ProductBattle />;
  }
  if (step === "final") {
    return <FinalChoice />;
  }

  // 첫 화면 (클라이언트 전용)
  const handleClick = () => {
    window.location.href = "/?step=category";
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">무신사 신상품 이상형 월드컵!</h1>
      <button
        className="mt-8 text-xl px-8 py-4 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition-colors"
        onClick={handleClick}
      >
        이상형 고르기!
      </button>
    </main>
  );
}
