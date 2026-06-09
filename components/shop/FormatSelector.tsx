"use client";

import type { ProductType } from "@/types/catalog";
import { PRODUCT_LABELS } from "@/types/catalog";
import { formatPrice } from "@/lib/catalog";

interface FormatSelectorProps {
  options: ProductType[];
  prices: Record<ProductType, number>;
  selected: ProductType;
  onChange: (value: ProductType) => void;
}

export default function FormatSelector({
  options,
  prices,
  selected,
  onChange,
}: FormatSelectorProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", padding: "0.65rem 0.875rem",
            borderRadius: "3px", border: "1px solid",
            borderColor: selected === opt ? "var(--ink)" : "var(--rule)",
            background: selected === opt ? "rgba(22,21,15,0.04)" : "transparent",
            transition: "border-color 0.15s, background 0.15s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Radio dot */}
            <div style={{
              width: "14px", height: "14px", borderRadius: "50%",
              border: `2px solid ${selected === opt ? "var(--ink)" : "var(--rule)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {selected === opt && (
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--ink)" }} />
              )}
            </div>
            <span style={{ fontSize: "0.8125rem", color: selected === opt ? "var(--ink)" : "var(--ink-2)" }}>
              {PRODUCT_LABELS[opt]}
            </span>
          </div>
          <span style={{ fontSize: "0.8125rem", color: selected === opt ? "var(--ink)" : "var(--faint)" }}>
            {formatPrice(prices[opt])}
          </span>
          <input
            type="radio"
            name="format"
            value={opt}
            checked={selected === opt}
            onChange={() => onChange(opt)}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          />
        </label>
      ))}
    </div>
  );
}
