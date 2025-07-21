"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/entities/product/api";
import { MusinsaProductItem } from "@/entities/product/types";

const DEFAULT_IMAGE = "https://via.placeholder.com/200x200?text=No+Image";

export function FinalChoice() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const categoryCode = params.get("categoryCode") || "";
  const sectionId = params.get("sectionId") || "200";
  const winner = params.get("winner");
  const { data, isLoading, error } = useQuery(
    productsQuery(categoryCode, sectionId)
  );

  if (!winner) {
    window.location.search = "/";
    return null;
  }

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  const product = (data?.items ?? []).find(
    (item: MusinsaProductItem) => item.id === winner
  );
  if (!product) return <div>상품 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-6">최종 선택한 상품</h2>
      <img
        src={product.image?.url || DEFAULT_IMAGE}
        alt={product.info.productName}
        className="w-60 h-60 object-cover rounded-xl border border-gray-200 mb-6"
      />
      <div className="font-semibold text-xl mb-2">
        {product.info.productName}
      </div>
      <div className="text-gray-500 text-lg mb-2">{product.info.brandName}</div>
      <div className="text-gray-900 text-lg mb-4">
        {product.info.finalPrice.toLocaleString()}원
      </div>
      <a
        href={product.onClick.url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-3 rounded-lg bg-red-500 text-white font-bold text-lg shadow hover:bg-red-600 transition-colors"
      >
        구매하러 가기
      </a>
    </div>
  );
}
