import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "5D Destiny",
  description: "五维命运系统应用平台"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
