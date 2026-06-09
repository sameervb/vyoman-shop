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

  const isPortrait = photo.aspectRatio === "2:3";

  return (
    <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2.5rem)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isPortrait ? "1fr 1fr" : "1.4fr 1fr", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "start" }}
        className="product-detail-grid">
        {/* Left: Image */}
        <div>
          <div style={{
            position: "relative",
            aspectRatio: isPortrait ? "2/3" : "3/2",
            borderRadius: "4px", overflow: "hidden",
            background: "var(--rule-2)",
          }}>
            <Image
              src={photo.displayImageUrl}
              alt={photo.title}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
              priority
            />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--faint)", marginTop: "0.75rem" }}>
            {photo.shotAt}
          </p>
        </div>

        {/* Right: Config */}
        <div style={{ display: "flex", flexDirection: "column", paddingTop: "0.5rem" }}>
          {/* Title */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.6rem" }}>
              {photo.location}
            </p>
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 360, fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)",
              letterSpacing: "-0.01em", lineHeight: 1.1,
              color: "var(--ink)",
            }}>
              {photo.title}
            </h1>
            <p style={{ marginTop: "1rem", fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--ink-2)" }}>
              {photo.description}
            </p>
          </div>

          {/* Format selector */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.75rem" }}>
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
          <p style={{ fontSize: "0.8rem", color: "var(--faint)", marginBottom: "1.5rem", lineHeight: 1.55 }}>
            {PRODUCT_DESCRIPTIONS[selectedProduct]}
          </p>

          {/* Personalisation (postcards only) */}
          {isPostcard && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.75rem" }}>
                Message for the back
              </h2>
              <PersonaliseField
                value={personalisation}
                onChange={setPersonalisation}
              />
            </div>
          )}

          {/* Price + CTA */}
          <div style={{ marginTop: "auto", paddingTop: "1.75rem", borderTop: "1px solid var(--rule-2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.75rem", fontWeight: 360, color: "var(--ink)" }}>
                {formatPrice(currentPrice)}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--faint)" }}>
                Ships in 3–5 working days
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                width: "100%", padding: "0.875rem 1.5rem",
                fontSize: "0.875rem", fontWeight: 600,
                borderRadius: "3px", border: "none", cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
                background: added ? "#3a6b3a" : "var(--ink)",
                color: added ? "#ffffff" : "var(--paper)",
                letterSpacing: "0.01em",
              }}
            >
              {added ? "Added to cart ✓" : "Add to cart →"}
            </button>

            {added && (
              <button
                onClick={() => router.push("/checkout")}
                style={{ width: "100%", marginTop: "0.6rem", padding: "0.6rem", fontSize: "0.85rem", background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", textDecoration: "underline", textUnderlineOffset: "3px" }}
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
