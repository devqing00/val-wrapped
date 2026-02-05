import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const shapingHeart = localFont({
  src: "../public/fonts/shaping-heart-font/Shapingheart.otf",
  variable: "--font-shaping-heart",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Val Wrapped 💕",
  description: "Will you be my Valentine?",
  openGraph: {
    title: "Val Wrapped 💕",
    description: "Someone wants to ask you something...",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${geistMono.variable} ${spaceMono.variable} ${shapingHeart.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
