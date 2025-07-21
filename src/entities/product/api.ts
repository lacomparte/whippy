import { apiClient, queryFactory } from "@/shared/api";
import {
  ProductApiResponse,
  MusinsaCategoryApiResponse,
  MusinsaCategoryTab,
  MusinsaProductRankingResponse,
  MusinsaProductItem,
} from "./types";

// 탭(카테고리) 쿼리
export const categoryTabsQuery = () =>
  queryFactory<{ tabs: MusinsaCategoryTab[] }, ["categoryTabs"]>(
    ["categoryTabs"],
    async () => {
      const { data } = await apiClient.get<MusinsaCategoryApiResponse>("", {
        params: {
          storeCode: "musinsa",
          sectionId: 200,
          contentsId: "",
          categoryCode: "000",
          gf: "A",
        },
      });
      // modules에서 type이 TAB_OUTLINED인 모듈의 tabs 반환
      const tabModule = (data.data.modules ?? []).find(
        (mod) => mod.type === "TAB_OUTLINED"
      );
      return {
        tabs: tabModule?.tabs ?? [],
      };
    }
  );

// 상품 쿼리 (MULTICOLUMN 모듈의 items만 flat하게 반환)
export const productsQuery = (categoryCode: string, sectionId: string) =>
  queryFactory<{ items: MusinsaProductItem[] }, ["products", string, string]>(
    ["products", categoryCode, sectionId],
    async () => {
      const { data } = await apiClient.get<MusinsaProductRankingResponse>(
        `/sections/${sectionId}`,
        {
          params: {
            storeCode: "musinsa",
            categoryCode,
            contentsId: "",
            gf: "A",
          },
        }
      );
      // MULTICOLUMN 모듈의 items만 flat하게 추출
      const items = (data.data.modules ?? [])
        .filter((mod) => mod.type === "MULTICOLUMN" && Array.isArray(mod.items))
        .flatMap((mod) => mod.items);
      return { items };
    }
  );
