"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default function OrderConfirmedPage({ params }: Props) {
  const clear = useCartStore((s) => s.clear);

  // Clear cart on confirmation
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-green-700/20 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="text-xl font-light text-[#f5f5f5] mb-3">
        Order confirmed
      </h1>
      <p className="text-sm text-[#888888] mb-6 leading-relaxed">
        Your order is confirmed. We&apos;ll email you when it ships.
        Usually 3–5 working days to Luxembourg, 5–7 days within the EU.
      </p>

      <Link
        href="/shop"
        className="text-sm text-[#d4a853] hover:underline"
      >
        View the collection →
      </Link>
    </div>
  );
}
