"use client";

import { useState } from "react";
import type { Photo, ProductType } from "@/types/catalog";
import { PRODUCT_LABELS } from "@/types/catalog";
import { getFilteredMinPrice } from "@/lib/catalog";
import ProductCard from "./ProductCard";

// ── Filter definitions ────────────────────────────────────────────────────────

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Postcards", value: "postcard_a6" },
  { label: "Prints & Canvas", value: "prints" },
  { label: "Gifts", value: "gifts" },
];

const PRINT_TYPES: ProductType[] = ["matte_poster", "framed_print", "canvas"];
const GIFT_TYPES: ProductType[] = ["mug", "tote_bag"];

/** Pick the best mockup product for a photo given the active filter.
 *  Checks what the photo actually carries — never shows a mockup for a
 *  product the photo doesn't have. */
function getPhotoMockup(photo: Photo, filter: string): ProductType | undefined {
  if (filter === "all") return undefined;
  if (filter === "postcard_a6") {
    return photo.availableProducts.includes("postcard_a6") ? "postcard_a6" : undefined;
  }
  if (filter === "prints") {
    for (const pt of PRINT_TYPES) {
      if (photo.availableProducts.includes(pt)) return pt;
    }
    return undefined;
  }
  if (filter === "gifts") {
    // Prefer mug; fall back to tote_bag — whichever this photo actually has
    if (photo.availableProducts.includes("mug")) return "mug";
    if (photo.availableProducts.includes("tote_bag")) return "tote_bag";
    return undefined;
  }
  return undefined;
}

/** Price shown on the card: minimum within the filtered category only. */
function getCardPrice(photo: Photo, filter: string): number {
  if (filter === "all") {
    return Math.min(...photo.availableProducts.map((pt) => photo.prices[pt]));
  }
  if (filter === "postcard_a6") return getFilteredMinPrice(photo, ["postcard_a6"]);
  if (filter === "prints") return getFilteredMinPrice(photo, PRINT_TYPES);
  if (filter === "gifts") return getFilteredMinPrice(photo, GIFT_TYPES);
  return Math.min(...photo.availableProducts.map((pt) => photo.prices[pt]));
}

/** Subtitle shown on the card: product label when filtered, location when All. */
function getCardSubtitle(photo: Photo, filter: string, mockupType: ProductType | undefined): string {
  if (filter === "all" || !mockupType) return photo.location;
  return PRODUCT_LABELS[mockupType];
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ProductGridProps {
  photos: Photo[];
  initialFilter?: string;
}

export default function ProductGrid({ photos, initialFilter = "all" }: ProductGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);

  const filtered =
    activeFilter === "all"
      ? photos
      : photos.filter((p) =>
          p.availableProducts.some((pt: ProductType) => {
            if (activeFilter === "prints") return PRINT_TYPES.includes(pt);
            if (activeFilter === "gifts") return GIFT_TYPES.includes(pt);
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
        {filtered.map((photo) => {
          const mockupType = getPhotoMockup(photo, activeFilter);
          const subtitle = getCardSubtitle(photo, activeFilter, mockupType);
          const price = getCardPrice(photo, activeFilter);
          // Show exact price (no "from") when only one product type in this filter
          const showFrom = activeFilter === "all"
            || (activeFilter === "prints" && PRINT_TYPES.filter(t => photo.availableProducts.includes(t)).length > 1)
            || (activeFilter === "gifts" && GIFT_TYPES.filter(t => photo.availableProducts.includes(t)).length > 1);

          return (
            <ProductCard
              key={photo.slug}
              photo={photo}
              mockupType={mockupType}
              subtitle={subtitle}
              price={price}
              showFrom={showFrom}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "var(--faint)", fontSize: "0.875rem", padding: "4rem 0", textAlign: "center" }}>
          No products found.
        </p>
      )}
    </div>
  );
}
