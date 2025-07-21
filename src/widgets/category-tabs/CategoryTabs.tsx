"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryTabsQuery } from "@/entities/product/api";
import { MusinsaCategoryTab } from "@/entities/product/types";

interface DrillState {
  tabs: MusinsaCategoryTab[];
  params: { categoryCode: string; sectionId: string };
}

export function CategoryTabs() {
  const { data, isLoading, error } = useQuery(categoryTabsQuery());
  const [drillStack, setDrillStack] = useState<DrillState[]>([]);

  // 최초 진입 시 1depth 세팅
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
      const params = new URLSearchParams(window.location.search);
      params.set("step", "battle");
      params.set("categoryCode", tab.params.categoryCode);
      params.set("sectionId", tab.params.sectionId);
      window.location.search = params.toString();
    }
  };

  const handleBack = () => {
    if (drillStack.length > 1) {
      setDrillStack(drillStack.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-6">카테고리를 선택하세요</h2>
      {drillStack.length > 1 && (
        <button
          className="mb-4 px-4 py-2 rounded bg-gray-200 text-gray-800"
          onClick={handleBack}
        >
          이전으로
        </button>
      )}
      <div className="flex flex-wrap gap-3 justify-center">
        {current?.tabs.length === 0 && <div>카테고리 없음</div>}
        {current?.tabs.map((tab: MusinsaCategoryTab) => (
          <button
            key={tab.key}
            className="px-6 py-3 rounded-lg border border-gray-800 bg-white text-gray-900 font-medium shadow hover:bg-gray-100 transition-colors mb-2"
            onClick={() => handleTabClick(tab)}
          >
            {tab.text.text}
          </button>
        ))}
      </div>
    </div>
  );
}
