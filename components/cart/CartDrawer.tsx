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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(22,21,15,0.35)", zIndex: 50, backdropFilter: "blur(4px)" }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, height: "100%",
          width: "100%", maxWidth: "400px",
          background: "var(--paper)", borderLeft: "1px solid var(--rule)",
          zIndex: 51, display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s ease",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--rule-2)" }}>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)", letterSpacing: "0.02em" }}>
            Your order{" "}
            {items.length > 0 && (
              <span style={{ color: "var(--faint)" }}>({items.length})</span>
            )}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", display: "flex", alignItems: "center" }}
            aria-label="Close cart"
          >
            <svg style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1rem", color: "var(--faint)" }}>
              <svg style={{ width: "40px", height: "40px", opacity: 0.35 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <p style={{ fontSize: "0.875rem" }}>Your cart is empty</p>
              <Link href="/shop" onClick={onClose}
                style={{ fontSize: "0.8125rem", color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Browse the collection →
              </Link>
            </div>
          ) : (
            <ul style={{ listStyle: "none" }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{ display: "flex", gap: "0.875rem", padding: "1rem 0", borderBottom: "1px solid var(--rule-2)" }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: "relative", width: "60px", height: "44px", borderRadius: "3px", overflow: "hidden", flexShrink: 0, background: "var(--rule-2)" }}>
                    <Image src={item.photoDisplayUrl} alt={item.photoTitle} fill className="object-cover" />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.8125rem", color: "var(--ink)", lineHeight: 1.35 }}>
                      {item.photoTitle}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--ink-2)", marginTop: "0.2rem" }}>
                      {PRODUCT_LABELS[item.productType]}
                    </p>
                    {item.personalisation && (
                      <p style={{ fontSize: "0.7rem", color: "var(--faint)", marginTop: "0.3rem", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        &ldquo;{item.personalisation}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Price + remove */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.8125rem", color: "var(--ink)" }}>
                      {formatPrice(item.priceCents)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.7rem", color: "var(--faint)" }}
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
          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--rule-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              <span style={{ color: "var(--ink-2)" }}>Subtotal</span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>{formatPrice(subtotalCents)}</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--faint)", marginBottom: "1rem" }}>
              Shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={onClose}
              style={{
                display: "block", width: "100%", background: "var(--ink)", color: "var(--paper)",
                textAlign: "center", padding: "0.875rem", borderRadius: "3px",
                fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.01em",
              }}
            >
              Proceed to checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
