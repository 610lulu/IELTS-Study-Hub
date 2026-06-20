import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "BandUp IELTS Study Hub",
  description: "A personal IELTS study dashboard for vocabulary, writing, speaking, and planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
