import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "해온이 — 오늘의 날씨",
  description: "서울과 양양의 오늘 날씨, 양양 동해 수온을 한 화면에.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "해온이",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#38bdf8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <main className="mx-auto max-w-[480px] sm:max-w-[640px] px-4 pt-6 pb-10 sm:pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
