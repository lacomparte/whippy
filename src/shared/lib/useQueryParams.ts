import { useRouter, useSearchParams } from "next/navigation";

export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 쿼리파람 객체로 반환
  const getAll = () => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  // 특정 쿼리파람 값 반환
  const get = (key: string) => searchParams.get(key);

  // 쿼리파람 변경(push)
  const push = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => current.set(k, v));
    router.push("?" + current.toString());
  };

  // 쿼리파람 변경(replace)
  const replace = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => current.set(k, v));
    router.replace("?" + current.toString());
  };

  return { get, getAll, push, replace };
}
