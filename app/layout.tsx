import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 除夕许愿墙",
  description: "写下你的新年愿望，等待午夜放飞。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="wish-wall-bg">{children}</body>
    </html>
  );
}
