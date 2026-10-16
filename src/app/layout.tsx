import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import "@/styles/globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsConsentBanner } from "@/components/analytics/AnalyticsConsentBanner";
import { siteOrigin } from "@/lib/seo/site";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  alternates: { canonical: siteOrigin() + "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "La Cà Đà Nẵng — Gợi ý trong 3 lần chạm",
    description: "Khám phá địa điểm ăn uống, vui chơi và trải nghiệm Đà Nẵng nhanh chóng trong tối đa 3 lần chạm.",
    url: siteOrigin() + "/",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/og/la-ca-da-nang-og.png",
        width: 1200,
        height: 630,
        alt: "La Cà Đà Nẵng — Khám phá Đà Nẵng theo cách của bạn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Cà Đà Nẵng — Gợi ý trong 3 lần chạm",
    description: "Khám phá địa điểm ăn uống, vui chơi và trải nghiệm Đà Nẵng nhanh chóng trong tối đa 3 lần chạm.",
    images: ["/og/la-ca-da-nang-og.png"],
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  title: "La Cà Đà Nẵng — Gợi ý trong 3 lần chạm",
  description: "Khám phá địa điểm ăn uống, vui chơi và trải nghiệm Đà Nẵng nhanh chóng trong tối đa 3 lần chạm.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0EA5E9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="min-h-screen bg-white text-slate-900 antialiased font-sans">
        <LocaleProvider>
          {children}
          <AnalyticsConsentBanner />
        </LocaleProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}

