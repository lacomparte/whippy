"use client";

import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/entities/product/api";
import { MusinsaProductItem } from "@/entities/product/types";
import { useQueryParams } from "@/shared/lib/useQueryParams";
import { useBattleState } from "./useBattleState";
import { ErrorBoundary } from "@/shared/lib/ErrorBoundary";

const DEFAULT_IMAGE = "https://via.placeholder.com/200x200?text=No+Image";

function ProductBattleInner() {
  const { get } = useQueryParams();
  const categoryCode = get("categoryCode") || "";
  const sectionId = get("sectionId") || "200";
  const { data, isLoading, error } = useQuery(
    productsQuery(categoryCode, sectionId)
  );
  const {
    battlePool,
    championId,
    challengerId,
    selected,
    setSelected,
    setBattlePool,
    setChampionId,
    history,
    push,
    replace,
  } = useBattleState(data);

  React.useEffect(() => {
    if (battlePool && battlePool.length === 1 && championId) {
      push({ step: "final", categoryCode, sectionId, winner: championId });
    }
  }, [battlePool, championId, categoryCode, sectionId, push]);

  if (isLoading || !battlePool || !championId || !challengerId) return null;
  if (error) return <div>에러 발생</div>;
  if (championId === challengerId) return <div>선택할 상품이 없습니다.</div>;

  const poolItems = (data?.items ?? []).reduce<
    Record<string, MusinsaProductItem>
  >((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  const champion = poolItems[championId];
  const challenger = poolItems[challengerId];

  if (!champion || !challenger) {
    return <div>선택할 상품이 없습니다.</div>;
  }

  const handleSelect = (winnerId: string) => {
    setSelected(winnerId);
    const loserId = winnerId === championId ? challengerId : championId;
    const newPool = battlePool.filter((id) => id !== loserId);
    setBattlePool(newPool);
    setChampionId(winnerId);
    replace({
      battlePool: newPool.join(","),
      champion: winnerId,
      history: [...history, winnerId].join(","),
    });
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-6">
        더 마음에 드는 상품을 선택하세요
      </h2>
      <div className="flex gap-8 mt-8">
        {[champion, challenger].map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <img
              src={item.image?.url || DEFAULT_IMAGE}
              alt={item.info?.productName || "상품"}
              className="w-52 h-52 object-cover rounded-xl border border-gray-200"
            />
            <div className="mt-3 font-semibold text-lg">
              {item.info?.productName || "상품명 없음"}
            </div>
            <div className="text-gray-500 text-sm">
              {item.info?.brandName || "브랜드 없음"}
            </div>
            <div className="text-gray-900 text-base">
              {item.info?.finalPrice !== undefined
                ? item.info.finalPrice.toLocaleString() + "원"
                : "가격 정보 없음"}
            </div>
            <button
              className="mt-4 px-6 py-2 rounded-lg bg-gray-900 text-white font-medium shadow hover:bg-gray-800 transition-colors text-base"
              onClick={() => handleSelect(item.id)}
              disabled={selected !== null}
            >
              선택
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-gray-500 text-sm">
        남은 라운드: {battlePool.length} / 20
      </div>
    </div>
  );
}

export function ProductBattle() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ErrorBoundary fallback={<div>배틀 에러 발생</div>}>
        <ProductBattleInner />
      </ErrorBoundary>
    </Suspense>
  );
}
