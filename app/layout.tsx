import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
title: "AI 面试系统",
description: "AI 产品经理综合能力评估",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="zh">
<body style={{ margin: 0, padding: 0, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
{children}
</body>
</html>
);
}
