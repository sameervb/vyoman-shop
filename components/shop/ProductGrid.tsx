"use client";

import { useState } from "react";
import type { Photo, ProductType } from "@/types/catalog";
import ProductCard from "./ProductCard";

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
              return (
                pt === "matte_poster" ||
                pt === "framed_print" ||
                pt === "canvas"
              );
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
      <div className="flex gap-1 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-1.5 text-sm rounded transition-colors ${
              activeFilter === f.value
                ? "bg-[#2a2a2a] text-[#f5f5f5]"
                : "text-[#888888] hover:text-[#f5f5f5]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((photo) => (
          <ProductCard key={photo.slug} photo={photo} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-[#888888] text-sm py-12 text-center">
          No products found.
        </p>
      )}
    </div>
  );
}
