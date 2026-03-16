import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Footer from "./Footer";
import Header from "./Header";
import KakaoInit from "./KakaoInit";
import { ToastProvider } from "./Toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://duckootest.pages.dev"),
  title: {
    default: "덕후테스트 - 애니메이션 퀴즈 & 게임 지식 테스트",
    template: "%s | 덕후테스트",
  },
  // ✏️ 검색 유입 키워드: 아래 description에 원하는 키워드를 자유롭게 추가/수정하세요
  description:
    "덕후 퀴즈, 덕후테스트, 포켓몬스터 퀴즈, 디아블로2 퀴즈, 원피스 퀴즈, 롤 퀴즈, 강철의 연금술사 퀴즈, MCU 퀴즈, 진격의 거인 퀴즈, 슬램덩크 퀴즈, 헌터x헌터 퀴즈, 애니메이션 퀴즈, 게임 지식 테스트 — 당신의 최애 작품 덕력을 확인하고 공식 인증서를 발급 받으세요!",
  keywords: [
    "덕후테스트",
    "원피스 퀴즈",
    "롤 퀴즈",
    "포켓몬스터 퀴즈",
    "강철의 연금술사 퀴즈",
    "디아블로2 퀴즈",
    "나 혼자만 레벨업 퀴즈",
    "MCU 퀴즈",
    "마블 퀴즈",
    "진격의 거인 퀴즈",
    "슬램덩크 퀴즈",
    "헌터x헌터 퀴즈",
    "애니 퀴즈",
    "영화 퀴즈",
    "게임 퀴즈",
  ],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "덕후테스트",
    title: "덕후테스트 - 최애 작품 덕력을 증명하세요!",
    description:
      "애니, 영화, 게임 등 다양한 분야의 진정한 덕후를 가려내는 프리미엄 팬덤 퀴즈 플랫폼",
    images: ["/og.png"],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "덕후테스트 - 최애 작품 덕력을 증명하세요!",
    description:
      "애니, 영화, 게임 등 다양한 분야의 진정한 덕후를 가려내는 프리미엄 팬덤 퀴즈 플랫폼",
    images: ["/og.png"],
  },
  verification: {
    google: "sHd9GFy0lNlMXxdvDJOSMaC_-6tsoCFHSnyAOhwCrPg",
  },
  other: {
    "google-adsense-account": "ca-pub-3939831601648260",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head />
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3939831601648260"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-8FRKH2L3HB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-8FRKH2L3HB');
          `}
        </Script>
        <ToastProvider>
          <KakaoInit />
          <Header />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
