"use client";

import { useState } from "react";
import type { Photo, ProductType } from "@/types/catalog";
import ProductCard from "./ProductCard";

// Map filter tab → which product mockup to show in cards
const FILTER_MOCKUP: Record<string, ProductType | undefined> = {
  all: undefined,
  postcard_a6: "postcard_a6",
  prints: "matte_poster",
  gifts: "mug",
};

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Postcards", value: "postcard_a6" },
  { label: "Prints & Canvas", value: "prints" },
  { label: "Gifts", value: "gifts" },
];

interface ProductGridProps {
  photos: Photo[];
}

export default function ProductGrid({ photos }: ProductGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered =
    activeFilter === "all"
      ? photos
      : photos.filter((p) =>
          p.availableProducts.some((pt: ProductType) => {
            if (activeFilter === "prints") {
              return pt === "matte_poster" || pt === "framed_print" || pt === "canvas";
            }
            if (activeFilter === "gifts") {
              return pt === "mug" || pt === "tote_bag";
            }
            return pt === activeFilter;
          })
        );

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "2.5rem", borderBottom: "1px solid var(--rule-2)", paddingBottom: "0" }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            style={{
              padding: "0.5rem 1.1rem 0.65rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.005em",
              transition: "color 0.15s",
              borderBottom: activeFilter === f.value ? "2px solid var(--ink)" : "2px solid transparent",
              marginBottom: "-1px",
              color: activeFilter === f.value ? "var(--ink)" : "var(--ink-2)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {filtered.map((photo) => (
          <ProductCard
            key={photo.slug}
            photo={photo}
            mockupType={FILTER_MOCKUP[activeFilter]}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "var(--faint)", fontSize: "0.875rem", padding: "4rem 0", textAlign: "center" }}>
          No products found.
        </p>
      )}
    </div>
  );
}
