"use client";

import React, { Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/entities/product/api";
import { MusinsaProductItem } from "@/entities/product/types";
import { useFinalChoiceParams } from "./useFinalChoice";
import { ErrorBoundary } from "@/shared/lib/ErrorBoundary";

const DEFAULT_IMAGE = "https://via.placeholder.com/200x200?text=No+Image";

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
        <img
          src={product.image?.url || DEFAULT_IMAGE}
          alt={product.info.productName}
          className="w-60 h-60 object-cover rounded-xl border border-gray-200 mb-6"
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
      </div>
    </div>
  );
}

export function FinalChoice() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ErrorBoundary fallback={<div>최종 선택 에러 발생</div>}>
        <FinalChoiceInner />
      </ErrorBoundary>
    </Suspense>
  );
}
