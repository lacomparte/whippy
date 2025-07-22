import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { apiClient } from "@/shared/api";
import { categoryTabsQuery, productsQuery } from "./api";

describe("product api", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });
  afterEach(() => {
    mock.restore();
  });

  it("categoryTabsQuery: 카테고리 탭 데이터를 정상적으로 반환한다", async () => {
    const mockTabs = [
      {
        key: "1",
        text: { text: "상의" },
        params: { categoryCode: "001", sectionId: "200" },
        tabs: [],
      },
    ];
    mock
      .onGet("")
      .reply(200, {
        data: { modules: [{ type: "TAB_OUTLINED", tabs: mockTabs }] },
      });
    const { queryFn } = categoryTabsQuery();
    const result = await queryFn();
    expect(result.tabs).toEqual(mockTabs);
  });

  it("productsQuery: 상품 리스트를 정상적으로 반환한다", async () => {
    const mockItems = [
      {
        id: "p1",
        info: { productName: "티셔츠", brandName: "브랜드", finalPrice: 10000 },
        image: { url: "img.jpg" },
      },
    ];
    mock
      .onGet(/sections\/200/)
      .reply(200, {
        data: { modules: [{ type: "MULTICOLUMN", items: mockItems }] },
      });
    const { queryFn } = productsQuery("001", "200");
    const result = await queryFn();
    expect(result.items).toEqual(mockItems);
  });
});
