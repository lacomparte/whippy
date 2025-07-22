import { useQueryParams } from "@/shared/lib/useQueryParams";

export function useFinalChoiceParams() {
  const { get, push } = useQueryParams();
  const categoryCode = get("categoryCode") || "";
  const sectionId = get("sectionId") || "200";
  const winner = get("winner");

  // winner가 없으면 홈으로 리다이렉트
  const redirectIfNoWinner = () => {
    if (!winner) push({});
  };

  return { categoryCode, sectionId, winner, redirectIfNoWinner };
}
