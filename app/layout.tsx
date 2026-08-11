import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SITE_NAME, SITE_URL } from "./lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA4_ID;

const siteDescription =
  "提供快速初步評估服務，填寫基本資料，由專人一對一協助並說明流程。";

export const metadata: Metadata = {
  title: {
    default: "新時代｜快速初步評估｜LINE 一對一諮詢",
    template: "%s｜新時代",
  },
  description: siteDescription,

  keywords: [
    "新時代",
    "LINE諮詢",
    "快速評估",
    "一對一服務",
    "專人協助",
  ],

  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "新時代｜快速初步評估",
    description: siteDescription,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/logo2.png",
        width: 1536,
        height: 1024,
        alt: "新時代 NEW ERA",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "新時代｜快速初步評估",
    description: siteDescription,
    images: ["/logo2.png"],
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
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {metaPixelId ? (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
              }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        ) : null}

        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}

        {children}
      </body>
    </html>
  );
}
