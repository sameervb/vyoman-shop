"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart";
import CartDrawer from "@/components/cart/CartDrawer";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[#2a2a2a] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Wordmark */}
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="text-sm font-medium tracking-[0.3em] text-[#f5f5f5] uppercase">
              Vyoman
            </span>
            <span className="text-xs text-[#888888] tracking-wider hidden sm:inline">
              Shop
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link
              href="/shop"
              className={`text-sm tracking-wide transition-colors ${
                pathname.startsWith("/shop") || pathname.startsWith("/product")
                  ? "text-[#f5f5f5]"
                  : "text-[#888888] hover:text-[#f5f5f5]"
              }`}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className={`text-sm tracking-wide transition-colors ${
                pathname === "/about"
                  ? "text-[#f5f5f5]"
                  : "text-[#888888] hover:text-[#f5f5f5]"
              }`}
            >
              About
            </Link>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#f5f5f5] transition-colors"
              aria-label={`Cart, ${itemCount} items`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="bg-[#d4a853] text-[#0a0a0a] text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-14" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
