import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({
  src: [
    { path: "../public/fonts/Geist-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Geist-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Geist-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "../public/fonts/GeistMono-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/GeistMono-Medium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://obeskrov.lol"),
  title: "obeskrov",
  description: "desenvolvedor front-end e designer de interfaces",
  icons: { icon: "/images/favicon.webp" },
  openGraph: {
    title: "obeskrov",
    description: "desenvolvedor front-end e designer de interfaces",
    url: "https://obeskrov.lol",
    siteName: "obeskrov",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <canvas id="particles" aria-hidden="true" />
        <div id="cursor" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
