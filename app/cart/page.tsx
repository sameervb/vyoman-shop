"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/catalog";
import { PRODUCT_LABELS } from "@/types/catalog";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotalCents = useCartStore((s) => s.subtotalCents());

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-[#888888] mb-6">Your cart is empty.</p>
        <Link
          href="/shop"
          className="text-sm text-[#d4a853] hover:underline"
        >
          Browse the collection →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-lg font-light text-[#f5f5f5] mb-8">
        Your order{" "}
        <span className="text-[#888888]">({items.length} item{items.length !== 1 ? "s" : ""})</span>
      </h1>

      <ul className="space-y-6">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-5 pb-6 border-b border-[#2a2a2a]"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
              <Image
                src={item.photoDisplayUrl}
                alt={item.photoTitle}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#f5f5f5]">{item.photoTitle}</p>
              <p className="text-xs text-[#888888] mt-0.5">
                {PRODUCT_LABELS[item.productType]}
                {item.frameOption && ` · ${item.frameOption} frame`}
              </p>
              {item.personalisation && (
                <p className="text-xs text-[#888888] mt-1.5 italic">
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
                className="text-xs text-[#888888] hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="mt-8 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[#888888]">Subtotal</span>
          <span className="text-[#f5f5f5]">{formatPrice(subtotalCents)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#888888]">Shipping</span>
          <span className="text-[#888888]">Calculated at checkout</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block mt-8 w-full bg-[#d4a853] hover:bg-[#c49843] text-[#0a0a0a] text-sm font-semibold text-center py-3.5 rounded transition-colors"
      >
        Proceed to checkout →
      </Link>
    </div>
  );
}
