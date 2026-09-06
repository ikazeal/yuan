import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "缘 · 山河有信，万物有缘",
  description: "一个关于相遇、善念与连接的数字东方美学空间。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
