import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.alp.musinsa.com/api2/hm/web/v5/pans/ranking",
  headers: {
    "Content-Type": "application/json",
  },
});

// query-factory 패턴 유틸
export function queryFactory<
  TQueryFnData,
  TQueryKey extends readonly unknown[],
  TData = TQueryFnData
>(
  key: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  select?: (data: TQueryFnData) => TData
) {
  return {
    queryKey: key,
    queryFn,
    ...(select && { select }),
  };
}
