import "./globals.css";
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/shared/api/queryClient";

export const metadata: Metadata = {
  title: "무신사 상품 이상형 월드컵",
  description: "상품 월드컵",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
