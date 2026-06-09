"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Photo, ProductType } from "@/types/catalog";
import { PRODUCT_LABELS, PRODUCT_DESCRIPTIONS } from "@/types/catalog";
import { formatPrice } from "@/lib/catalog";
import { useCartStore } from "@/store/cart";
import PersonaliseField from "./PersonaliseField";
import FormatSelector from "./FormatSelector";

interface ProductDetailProps {
  photo: Photo;
}

export default function ProductDetail({ photo }: ProductDetailProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(
    photo.availableProducts[0]
  );
  const [personalisation, setPersonalisation] = useState("");
  const [added, setAdded] = useState(false);

  const currentPrice = photo.prices[selectedProduct];
  const isPostcard = selectedProduct === "postcard_a6";

  function handleAddToCart() {
    addItem({
      id: crypto.randomUUID(),
      photoSlug: photo.slug,
      photoTitle: photo.title,
      photoDisplayUrl: photo.displayImageUrl,
      productType: selectedProduct,
      frameOption: undefined,
      personalisation: isPostcard && personalisation ? personalisation : undefined,
      priceCents: currentPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Image */}
        <div>
          <div className={`relative ${photo.aspectRatio === "2:3" ? "aspect-[2/3]" : "aspect-[3/2]"} rounded overflow-hidden bg-[#1a1a1a]`}>
            <Image
              src={photo.displayImageUrl}
              alt={photo.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          <p className="text-xs text-[#888888] mt-3">{photo.shotAt}</p>
        </div>

        {/* Right: Config */}
        <div className="flex flex-col">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-xl font-medium text-[#f5f5f5]">
              {photo.title}
            </h1>
            <p className="text-sm text-[#888888] mt-1">{photo.location}</p>
            <p className="text-sm text-[#cccccc] mt-4 leading-relaxed">
              {photo.description}
            </p>
          </div>

          {/* Format selector */}
          <div className="mb-6">
            <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-3">
              Format
            </h2>
            <FormatSelector
              options={photo.availableProducts}
              prices={photo.prices}
              selected={selectedProduct}
              onChange={setSelectedProduct}
            />
          </div>

          {/* Product description */}
          <p className="text-xs text-[#888888] mb-6">
            {PRODUCT_DESCRIPTIONS[selectedProduct]}
          </p>

          {/* Personalisation (only for postcards) */}
          {isPostcard && (
            <div className="mb-6">
              <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-3">
                Message for the back
              </h2>
              <PersonaliseField
                value={personalisation}
                onChange={setPersonalisation}
              />
            </div>
          )}

          {/* Price + CTA */}
          <div className="mt-auto pt-6 border-t border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-light text-[#f5f5f5]">
                {formatPrice(currentPrice)}
              </span>
              <span className="text-xs text-[#888888]">
                Ships in 3–5 working days
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 text-sm font-semibold rounded transition-all ${
                added
                  ? "bg-green-700/60 text-white"
                  : "bg-[#d4a853] hover:bg-[#c49843] text-[#0a0a0a]"
              }`}
            >
              {added ? "Added to cart ✓" : "Add to cart →"}
            </button>

            {added && (
              <button
                onClick={() => router.push("/checkout")}
                className="w-full mt-2 py-2.5 text-sm text-[#d4a853] hover:underline"
              >
                Proceed to checkout →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
