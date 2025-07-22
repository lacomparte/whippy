"use client";

import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/entities/product/api";
import { MusinsaProductItem } from "@/entities/product/types";
import { useQueryParams } from "@/shared/lib/useQueryParams";
import { useBattleState } from "./useBattleState";
import { ErrorBoundary } from "@/shared/lib/ErrorBoundary";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  React.useEffect(() => {
    if (battlePool && battlePool.length === 1 && championId) {
      router.push(
        `/champion?categoryCode=${categoryCode}&sectionId=${sectionId}&winner=${championId}`
      );
    }
  }, [battlePool, championId, categoryCode, sectionId, router]);

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
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="card w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-title mb-8 text-center">
          더 마음에 드는 상품을 선택하세요
        </h2>
        <div className="flex flex-row items-center justify-center gap-8 w-full">
          <div className="flex-1 flex justify-end">
            <div className="flex flex-col items-center w-64">
              <img
                src={champion.image?.url || DEFAULT_IMAGE}
                alt={champion.info?.productName || "상품"}
                className="w-52 h-52 object-cover rounded-xl border border-gray-200 mb-4"
              />
              <div className="mt-3 font-semibold text-lg text-center">
                {champion.info?.productName || "상품명 없음"}
              </div>
              <div className="text-gray text-sm mb-1">
                {champion.info?.brandName || "브랜드 없음"}
              </div>
              <div className="text-black text-base mb-2">
                {champion.info?.finalPrice !== undefined
                  ? champion.info.finalPrice.toLocaleString() + "원"
                  : "가격 정보 없음"}
              </div>
              <button
                className="btn-black mt-4 w-full text-base"
                onClick={() => handleSelect(champion.id)}
                disabled={selected !== null}
              >
                선택
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center mx-6">
            <span className="text-4xl font-extrabold text-gray-400 select-none">
              VS
            </span>
          </div>
          <div className="flex-1 flex justify-start">
            <div className="flex flex-col items-center w-64">
              <img
                src={challenger.image?.url || DEFAULT_IMAGE}
                alt={challenger.info?.productName || "상품"}
                className="w-52 h-52 object-cover rounded-xl border border-gray-200 mb-4"
              />
              <div className="mt-3 font-semibold text-lg text-center">
                {challenger.info?.productName || "상품명 없음"}
              </div>
              <div className="text-gray text-sm mb-1">
                {challenger.info?.brandName || "브랜드 없음"}
              </div>
              <div className="text-black text-base mb-2">
                {challenger.info?.finalPrice !== undefined
                  ? challenger.info.finalPrice.toLocaleString() + "원"
                  : "가격 정보 없음"}
              </div>
              <button
                className="btn-outline mt-4 w-full text-base"
                onClick={() => handleSelect(challenger.id)}
                disabled={selected !== null}
              >
                선택
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-gray text-sm">
          남은 라운드: {battlePool.length} / 20
        </div>
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
