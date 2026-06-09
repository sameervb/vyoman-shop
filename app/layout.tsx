import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartProvider from "@/components/cart/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vyoman Shop · Luxembourg From Above",
  description:
    "Original aerial photography of Luxembourg. Postcards, art prints, and sticker packs. Shot by Vyoman on a DJI Mini 5 Pro.",
  openGraph: {
    title: "Vyoman Shop · Luxembourg From Above",
    description:
      "Original aerial photography of Luxembourg. Postcards, art prints, and sticker packs.",
    url: "https://shop.vyomanaerials.com",
    siteName: "Vyoman Shop",
    images: [
      {
        url: "https://shop.vyomanaerials.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_EU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f5f5] antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
