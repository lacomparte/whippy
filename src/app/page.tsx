"use client";

import React, { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useQueryParams } from "@/shared/lib/useQueryParams";

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

function MainRouter() {
  const { get, push } = useQueryParams();
  const step = get("step");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    // step이 없고 쿼리파람이 이미 비어있으면 push를 하지 않음
    if (!step && typeof window !== "undefined" && window.location.search === "")
      return;
    if (!step || !["category", "battle", "final"].includes(step)) {
      push({});
    }
  }, [step, push]);

  if (!hydrated) return null;

  if (step === "category") return <CategoryTabs />;
  if (step === "battle") return <ProductBattle />;
  if (step === "final") return <FinalChoice />;

  // 첫 화면 (SSR)
  const handleClick = () => {
    push({ step: "category" });
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

export default function Home() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ErrorBoundary fallback={<div>페이지 에러 발생</div>}>
        <MainRouter />
      </ErrorBoundary>
    </Suspense>
  );
}

class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
