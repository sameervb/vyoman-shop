"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/catalog";
import { PRODUCT_LABELS } from "@/types/catalog";
import { useEffect } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotalCents = useCartStore((s) => s.subtotalCents());

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#141414] border-l border-[#2a2a2a] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2a2a]">
          <h2 className="text-sm font-medium tracking-wide text-[#f5f5f5]">
            Your order{" "}
            {items.length > 0 && (
              <span className="text-[#888888]">({items.length})</span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-[#f5f5f5] transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#888888]">
              <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <p className="text-sm">Your cart is empty</p>
              <button onClick={onClose}>
                <Link
                  href="/shop"
                  className="text-sm text-[#d4a853] hover:underline"
                  onClick={onClose}
                >
                  Browse the collection →
                </Link>
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-[#2a2a2a] last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-[#2a2a2a]">
                    <Image
                      src={item.photoDisplayUrl}
                      alt={item.photoTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f5f5f5] leading-snug">
                      {item.photoTitle}
                    </p>
                    <p className="text-xs text-[#888888] mt-0.5">
                      {PRODUCT_LABELS[item.productType]}
                      {item.frameOption && ` · ${item.frameOption} frame`}
                    </p>
                    {item.personalisation && (
                      <p className="text-xs text-[#888888] mt-1 italic line-clamp-1">
                        &ldquo;{item.personalisation}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Price + remove */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <span className="text-sm text-[#f5f5f5]">
                      {formatPrice(item.priceCents)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#888888] hover:text-red-400 transition-colors text-xs"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#2a2a2a] space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#888888]">Subtotal</span>
              <span className="text-[#f5f5f5]">{formatPrice(subtotalCents)}</span>
            </div>
            <p className="text-xs text-[#888888]">
              Shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a0a0a] text-sm font-semibold text-center py-3 rounded transition-colors"
            >
              Proceed to checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
