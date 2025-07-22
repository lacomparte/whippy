"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5]">
      <h1 className="text-title mb-8">무신사 신상품 이상형 월드컵!</h1>
      <button
        className="btn-black mt-8 text-xl"
        onClick={() => router.push("/choice")}
      >
        이상형 고르기!
      </button>
    </main>
  );
}
