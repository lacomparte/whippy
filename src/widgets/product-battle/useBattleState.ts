import { useEffect, useState } from "react";
import { useQueryParams } from "@/shared/lib/useQueryParams";
import { MusinsaProductItem } from "@/entities/product/types";

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

export function useBattleState(
  data: { items: MusinsaProductItem[] } | undefined
) {
  const { get, push, replace } = useQueryParams();
  const poolParam = get("battlePool");
  const championParam = get("champion");
  const historyParam = get("history");
  const [battlePool, setBattlePool] = useState<string[] | null>(null);
  const [championId, setChampionId] = useState<string | null>(null);
  const [challengerId, setChallengerId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const history = historyParam?.split(",").filter(Boolean) || [];

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
      // 이미 쿼리파람이 원하는 값이면 replace 호출하지 않음
      if (poolParam === pool.join(",") && championParam === champion) {
        setBattlePool(pool);
        setChampionId(champion);
        return;
      }
      setBattlePool(pool);
      setChampionId(champion);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      replace({ battlePool: pool.join(","), champion });
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

  return {
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
  };
}
