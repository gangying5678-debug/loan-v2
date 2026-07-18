import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "新時代｜快速初步評估｜LINE 一對一諮詢",

  description:
    "提供快速初步評估服務，填寫基本資料，由專人一對一協助，LINE 即時諮詢，流程透明、回覆快速。",

  keywords: [
    "新時代",
    "LINE諮詢",
    "快速評估",
    "一對一服務",
    "專人協助",
  ],

  metadataBase: new URL("https://loan-v2-one.vercel.app"),

  openGraph: {
    title: "新時代",
    description:
      "填寫基本資料，由專人協助初步評估，LINE 即時諮詢。",
    url: "https://loan-v2-one.vercel.app",
    siteName: "新時代",
    locale: "zh_TW",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
