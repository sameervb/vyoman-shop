import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartProvider from "@/components/cart/CartProvider";

export const metadata: Metadata = {
  title: "Vyoman Shop · Luxembourg From Above",
  description:
    "Original aerial photography of Luxembourg. Postcards, art prints, canvas, and gifts. Shot by Vyoman on a DJI Mini 5 Pro.",
  openGraph: {
    title: "Vyoman Shop · Luxembourg From Above",
    description:
      "Original aerial photography of Luxembourg. Postcards, prints, canvas, mugs, and totes.",
    url: "https://shop.vyomanaerials.com",
    siteName: "Vyoman Shop",
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
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#F1EEE7" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..500;1,9..144,300..500&family=Hanken+Grotesk:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
