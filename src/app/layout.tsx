import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CartBadge } from "@/components/cart/cart-badge";
import { CartProvider } from "@/contexts/cart-context";
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
  title: "Shopee Mini Storefront",
  description: "Curated product catalog for the Shopee Mini MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-orange-50/40">
            <header className="border-b border-orange-100 bg-white/80 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
                <Link
                  href="/"
                  className="text-lg font-semibold tracking-tight text-orange-600"
                >
                  Shopee Mini
                </Link>
                <CartBadge />
              </div>
            </header>
            <div className="flex-1">{children}</div>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
