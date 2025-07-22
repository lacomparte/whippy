import { useEffect, useState, useRef } from "react";
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

  // pool/champion 캐싱용 ref
  const lastInitRef = useRef<{ pool: string[]; champion: string } | null>(null);

  // pool/챔피언 초기화
  useEffect(() => {
    if (!data) return;
    // 쿼리파람이 있으면 state만 동기화 (replace 호출 X)
    if (poolParam && championParam) {
      const poolArr = poolParam.split(",");
      if (JSON.stringify(battlePool) !== JSON.stringify(poolArr)) {
        setBattlePool(poolArr);
      }
      if (championId !== championParam) {
        setChampionId(championParam);
      }
      lastInitRef.current = null; // 쿼리파람 기반이면 캐시 리셋
      return; // 쿼리파람이 있으면 여기서 끝
    }
    // 쿼리파람이 없고, 데이터가 있으면 pool/champion을 만들고 setState만 한다
    if (!poolParam && data.items.length > 0) {
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
      // 이전에 동일한 pool/champion으로 초기화했다면 아무것도 하지 않음
      if (
        lastInitRef.current &&
        JSON.stringify(lastInitRef.current.pool) === JSON.stringify(pool) &&
        lastInitRef.current.champion === champion
      ) {
        return;
      }
      setBattlePool(pool);
      setChampionId(champion);
      lastInitRef.current = { pool, champion };
      // replace는 별도 useEffect에서 처리
    }
  }, [data, poolParam, championParam]);

  // 쿼리파람이 없고, battlePool/championId가 세팅된 경우에만 replace를 호출
  useEffect(() => {
    if (!data) return;
    if (!poolParam && battlePool && championId) {
      replace({ battlePool: battlePool.join(","), champion: championId });
    }
  }, [data, poolParam, battlePool, championId, replace]);

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
    history,
    push,
    replace,
  };
}
