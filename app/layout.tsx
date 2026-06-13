import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const switzer = localFont({
  src: [
    { path: "../public/fonts/Switzer-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Switzer-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Switzer-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-switzer",
});

const gallant = localFont({
  src: "../public/fonts/Gallant-Regular.woff2",
  variable: "--font-gallant",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://obeskrov.lol"),
  title: "obeskrov",
  description: "frontend developer & ui designer",
  icons: { icon: "/images/favicon.webp" },
  openGraph: {
    title: "obeskrov",
    description: "frontend developer & ui designer",
    url: "https://obeskrov.lol",
    siteName: "obeskrov",
    images: ["/images/miniaylan.jpeg"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${switzer.variable} ${gallant.variable}`}>
        {children}
      </body>
    </html>
  );
}
