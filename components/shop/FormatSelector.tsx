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
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center justify-between cursor-pointer px-4 py-3 rounded border transition-colors ${
            selected === opt
              ? "border-[#d4a853] bg-[#d4a853]/5"
              : "border-[#2a2a2a] hover:border-[#3a3a3a]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === opt
                  ? "border-[#d4a853]"
                  : "border-[#888888]"
              }`}
            >
              {selected === opt && (
                <div className="w-2 h-2 rounded-full bg-[#d4a853]" />
              )}
            </div>
            <span
              className={`text-sm ${
                selected === opt ? "text-[#f5f5f5]" : "text-[#888888]"
              }`}
            >
              {PRODUCT_LABELS[opt]}
            </span>
          </div>
          <span
            className={`text-sm ${
              selected === opt ? "text-[#d4a853]" : "text-[#888888]"
            }`}
          >
            {formatPrice(prices[opt])}
          </span>
          <input
            type="radio"
            name="format"
            value={opt}
            checked={selected === opt}
            onChange={() => onChange(opt)}
            className="sr-only"
          />
        </label>
      ))}
    </div>
  );
}
