"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/entities/product/api";
import { MusinsaProductItem } from "@/entities/product/types";

const DEFAULT_IMAGE = "https://via.placeholder.com/200x200?text=No+Image";

function getRandomChallenger(
  pool: string[],
  championId: string
): string | null {
  const candidates = pool.filter((id) => id !== championId);
  if (candidates.length === 0) return null;
  const idx = Math.floor(
    (window.crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) *
      candidates.length
  );
  return candidates[idx];
}

export function ProductBattle() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const categoryCode = params.get("categoryCode") || "";
  const sectionId = params.get("sectionId") || "200";
  const poolParam = params.get("battlePool");
  const championParam = params.get("champion");
  const history = params.get("history")?.split(",").filter(Boolean) || [];
  const { data, isLoading, error } = useQuery(
    productsQuery(categoryCode, sectionId)
  );
  const [battlePool, setBattlePool] = useState<string[] | null>(null);
  const [championId, setChampionId] = useState<string | null>(null);
  const [challengerId, setChallengerId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // pool/챔피언 초기화
  useEffect(() => {
    if (!data) return;
    if (poolParam && championParam) {
      setBattlePool(poolParam.split(","));
      setChampionId(championParam);
    } else if (!poolParam && data.items.length > 0) {
      // 20개 랜덤 pool, 챔피언 1개 랜덤 선택
      const sample = [...data.items];
      for (let i = sample.length - 1; i > 0; i--) {
        const j = Math.floor(
          (window.crypto.getRandomValues(new Uint32Array(1))[0] /
            (0xffffffff + 1)) *
            (i + 1)
        );
        [sample[i], sample[j]] = [sample[j], sample[i]];
      }
      const pool = sample.slice(0, 20).map((item) => item.id);
      const champion = pool[0];
      setBattlePool(pool);
      setChampionId(champion);
      // 쿼리파람에 저장
      const p = new URLSearchParams(window.location.search);
      p.set("battlePool", pool.join(","));
      p.set("champion", champion);
      window.history.replaceState(null, "", `?${p.toString()}`);
    }
  }, [data, poolParam, championParam]);

  // challenger 갱신
  useEffect(() => {
    if (!battlePool || !championId) return;
    setChallengerId(getRandomChallenger(battlePool, championId));
  }, [battlePool, championId]);

  // 선택 초기화
  useEffect(() => {
    setSelected(null);
  }, [battlePool, championId]);

  // 최종 1개 남으면 step=final로 이동
  useEffect(() => {
    if (battlePool && battlePool.length === 1 && championId) {
      const p = new URLSearchParams(window.location.search);
      p.set("step", "final");
      p.set("categoryCode", categoryCode);
      p.set("sectionId", sectionId);
      p.set("winner", championId);
      window.location.search = p.toString();
    }
  }, [battlePool, championId, categoryCode, sectionId]);

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

  const handleSelect = (winnerId: string) => {
    setSelected(winnerId);
    // loser 제거, 챔피언 갱신
    const loserId = winnerId === championId ? challengerId : championId;
    const newPool = battlePool.filter((id) => id !== loserId);
    setBattlePool(newPool);
    setChampionId(winnerId);
    // 쿼리파람 갱신
    const p = new URLSearchParams(window.location.search);
    p.set("battlePool", newPool.join(","));
    p.set("champion", winnerId);
    p.set("history", [...history, winnerId].join(","));
    window.history.replaceState(null, "", `?${p.toString()}`);
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
              alt={item.info.productName}
              className="w-52 h-52 object-cover rounded-xl border border-gray-200"
            />
            <div className="mt-3 font-semibold text-lg">
              {item.info.productName}
            </div>
            <div className="text-gray-500 text-sm">{item.info.brandName}</div>
            <div className="text-gray-900 text-base">
              {item.info.finalPrice.toLocaleString()}원
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
