"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryTabsQuery } from "@/entities/product/api";
import { MusinsaCategoryTab } from "@/entities/product/types";
import { useQueryParams } from "@/shared/lib/useQueryParams";
import { ErrorBoundary } from "@/shared/lib/ErrorBoundary";
import { useRouter } from "next/navigation";

interface DrillState {
  tabs: MusinsaCategoryTab[];
  params: { categoryCode: string; sectionId: string };
}

function CategoryTabsInner() {
  const { get, push } = useQueryParams();
  const { data, isLoading, error } = useQuery(categoryTabsQuery());
  const [drillStack, setDrillStack] = useState<DrillState[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (data?.tabs) {
      setDrillStack([
        { tabs: data.tabs, params: { categoryCode: "000", sectionId: "200" } },
      ]);
    }
  }, [data]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) {
    console.error(error);
    return <div>에러 발생</div>;
  }

  const current = drillStack[drillStack.length - 1];
  const handleTabClick = (tab: MusinsaCategoryTab) => {
    if (tab.tabs && tab.tabs.length > 0) {
      setDrillStack([...drillStack, { tabs: tab.tabs, params: tab.params }]);
    } else {
      // tabs가 비어있으면 상품 배틀로 이동
      router.push(
        `/battle?categoryCode=${tab.params.categoryCode}&sectionId=${tab.params.sectionId}`
      );
    }
  };

  const handleBack = () => {
    if (drillStack.length > 1) {
      setDrillStack(drillStack.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="card w-full max-w-2xl flex flex-col items-center">
        <h2 className="text-title mb-6 text-center">카테고리를 선택하세요</h2>
        {drillStack.length > 1 && (
          <button className="mb-4 btn-outline" onClick={handleBack}>
            이전으로
          </button>
        )}
        <div className="flex flex-wrap gap-3 justify-center w-full">
          {current?.tabs.length === 0 && <div>카테고리 없음</div>}
          {current?.tabs.map((tab: MusinsaCategoryTab) => (
            <button
              key={tab.key}
              className="btn-outline mb-2 min-w-[120px]"
              onClick={() => handleTabClick(tab)}
            >
              {tab.text.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryTabs() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ErrorBoundary fallback={<div>카테고리 에러 발생</div>}>
        <CategoryTabsInner />
      </ErrorBoundary>
    </Suspense>
  );
}
