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
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "clamp(5rem, 10vw, 8rem) clamp(1.25rem, 4vw, 2.5rem)", textAlign: "center" }}>
        <p style={{ color: "var(--faint)", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
          Your cart is empty.
        </p>
        <Link href="/shop" style={{ fontSize: "0.875rem", color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          Browse the collection →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "clamp(5rem, 8vw, 6rem) clamp(1.25rem, 4vw, 2.5rem) 4rem" }}>
      <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 360, fontSize: "clamp(1.6rem, 3vw, 2rem)", letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: "2.5rem" }}>
        Your order{" "}
        <span style={{ fontSize: "1rem", color: "var(--faint)", fontFamily: "inherit" }}>
          ({items.length} item{items.length !== 1 ? "s" : ""})
        </span>
      </h1>

      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0" }}>
        {items.map((item) => (
          <li key={item.id} style={{ display: "flex", gap: "1rem", padding: "1.25rem 0", borderBottom: "1px solid var(--rule-2)", alignItems: "flex-start" }}>
            <div style={{ position: "relative", width: "72px", height: "52px", borderRadius: "3px", overflow: "hidden", flexShrink: 0, background: "var(--rule-2)" }}>
              <Image src={item.photoDisplayUrl} alt={item.photoTitle} fill className="object-cover" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.875rem", color: "var(--ink)", fontWeight: 500 }}>{item.photoTitle}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--ink-2)", marginTop: "0.2rem" }}>
                {PRODUCT_LABELS[item.productType]}
              </p>
              {item.personalisation && (
                <p style={{ fontSize: "0.75rem", color: "var(--faint)", marginTop: "0.4rem", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  &ldquo;{item.personalisation}&rdquo;
                </p>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", flexShrink: 0, gap: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--ink)", fontWeight: 500 }}>
                {formatPrice(item.priceCents)}
              </span>
              <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--faint)" }}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid var(--rule-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.4rem" }}>
          <span style={{ color: "var(--ink-2)" }}>Subtotal</span>
          <span style={{ color: "var(--ink)", fontWeight: 500 }}>{formatPrice(subtotalCents)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "1.75rem" }}>
          <span style={{ color: "var(--ink-2)" }}>Shipping</span>
          <span style={{ color: "var(--faint)" }}>Calculated at checkout</span>
        </div>
        <Link
          href="/checkout"
          style={{
            display: "block", width: "100%", background: "var(--ink)", color: "var(--paper)",
            textAlign: "center", padding: "0.9rem",
            fontSize: "0.875rem", fontWeight: 600, borderRadius: "3px",
            letterSpacing: "0.01em", boxSizing: "border-box",
          }}
        >
          Proceed to checkout →
        </Link>
      </div>
    </div>
  );
}
