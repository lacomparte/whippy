"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/entities/product/api";
import { MusinsaProductItem } from "@/entities/product/types";
import { useFinalChoiceParams } from "./useFinalChoice";
import { ErrorBoundary } from "@/shared/lib/ErrorBoundary";
import { LoadingSpinner } from "@/shared/lib/LoadingSpinner";

const DEFAULT_IMAGE = "https://via.placeholder.com/200x200?text=No+Image";

function BattleImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="w-full max-w-[400px] h-[400px] flex items-center justify-center relative mb-6">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover object-center rounded-xl border border-gray-200 transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
    </div>
  );
}

function FinalChoiceInner() {
  const { categoryCode, sectionId, winner, redirectIfNoWinner } =
    useFinalChoiceParams();
  const { data, isLoading, error } = useQuery(
    productsQuery(categoryCode, sectionId)
  );

  useEffect(() => {
    redirectIfNoWinner();
  }, [winner, redirectIfNoWinner]);

  if (!winner) return null;
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  const product = (data?.items ?? []).find(
    (item: MusinsaProductItem) => item.id === winner
  );
  if (!product) return <div>상품 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="card w-full max-w-xl flex flex-col items-center">
        <h2 className="text-title mb-6">최종 선택한 상품</h2>
        <BattleImage
          src={product.image?.url || DEFAULT_IMAGE}
          alt={product.info.productName}
        />
        <div className="font-semibold text-xl mb-2">
          {product.info.productName}
        </div>
        <div className="text-gray text-lg mb-2">{product.info.brandName}</div>
        <div className="text-black text-lg mb-4">
          {product.info.finalPrice.toLocaleString()}원
        </div>
        <a
          href={product.onClick.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-black text-lg w-full text-center"
        >
          구매하러 가기
        </a>
        <button
          className="btn-outline text-lg w-full text-center mt-4"
          onClick={() => {
            // 카테고리 선택(첫 화면)으로 이동
            window.location.href = "/choice";
          }}
        >
          다시 선택하기
        </button>
      </div>
    </div>
  );
}

export function FinalChoice() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorBoundary fallback={<div>최종 선택 에러 발생</div>}>
        <FinalChoiceInner />
      </ErrorBoundary>
    </Suspense>
  );
}
