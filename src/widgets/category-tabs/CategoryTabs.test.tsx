import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryTabs } from "./CategoryTabs";
import { useRouter } from "next/navigation";
import * as api from "@/entities/product/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/entities/product/api");

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

const mockTabs = [
  {
    key: "1",
    text: { text: "상의" },
    params: { categoryCode: "001", sectionId: "200" },
    tabs: [],
  },
  {
    key: "2",
    text: { text: "하의" },
    params: { categoryCode: "002", sectionId: "200" },
    tabs: [],
  },
];

(api.categoryTabsQuery as jest.Mock).mockReturnValue({
  queryKey: ["categoryTabs"],
  queryFn: async () => ({ tabs: mockTabs }),
});

function renderWithProvider(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("CategoryTabs", () => {
  it("카테고리 버튼 클릭 시 /battle로 이동하며 파라미터가 전달된다", async () => {
    renderWithProvider(<CategoryTabs />);
    const btn = await screen.findByText("상의");
    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith(
      "/battle?categoryCode=001&sectionId=200"
    );
  });
});
