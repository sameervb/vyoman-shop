"use client";

import { useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { useCartStore } from "@/store/cart";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default function OrderConfirmedPage({ params }: Props) {
  const { orderId } = use(params);
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div style={{ maxWidth: "520px", margin: "0 auto", padding: "clamp(6rem, 12vw, 10rem) clamp(1.25rem, 4vw, 2.5rem)", textAlign: "center" }}>
      {/* Checkmark */}
      <div style={{
        width: "52px", height: "52px", borderRadius: "50%",
        background: "rgba(63,185,80,0.12)", border: "1px solid rgba(63,185,80,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1.75rem",
      }}>
        <svg width="22" height="22" fill="none" stroke="#3fb950" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 style={{
        fontFamily: "'Fraunces', Georgia, serif", fontWeight: 360,
        fontSize: "clamp(1.6rem, 3vw, 2rem)", letterSpacing: "-0.01em",
        color: "var(--ink)", marginBottom: "1rem",
      }}>
        Order confirmed
      </h1>

      <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--ink-2)", marginBottom: "0.5rem" }}>
        Your order is in — thank you.
      </p>
      <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--faint)", marginBottom: "2.5rem" }}>
        We&apos;ve sent a confirmation to your email.
        Usually 3–5 working days to Luxembourg, 5–7 days within the EU.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", alignItems: "center" }}>
        <Link
          href={`/track/${orderId}`}
          style={{
            display: "inline-block",
            background: "var(--ink)", color: "var(--paper)",
            padding: "0.8rem 2rem", borderRadius: "3px",
            fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.01em",
          }}
        >
          Track your order →
        </Link>
        <Link
          href="/shop"
          style={{
            fontSize: "0.875rem", color: "var(--faint)",
            textDecoration: "underline", textUnderlineOffset: "3px",
          }}
        >
          View the collection
        </Link>
      </div>
    </div>
  );
}
