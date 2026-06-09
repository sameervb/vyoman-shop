"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Photo, ProductType } from "@/types/catalog";
import { PRODUCT_LABELS, PRODUCT_DESCRIPTIONS, PRODUCT_SPECS } from "@/types/catalog";
import { formatPrice } from "@/lib/catalog";
import { useCartStore } from "@/store/cart";
import PersonaliseField from "./PersonaliseField";
import FormatSelector from "./FormatSelector";
import ProductMockup from "./ProductMockup";

type GalleryView = "photo" | "mockup" | "specs";

interface ProductDetailProps {
  photo: Photo;
}

// ── Spec row ─────────────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "0.6rem 0", borderBottom: "1px solid var(--rule-2)" }}>
      <span style={{ fontSize: "0.75rem", color: "var(--faint)", width: "90px", flexShrink: 0, paddingTop: "0.05rem", fontWeight: 500 }}>
        {label}
      </span>
      <span style={{ fontSize: "0.8125rem", color: "var(--ink-2)", lineHeight: 1.5 }}>
        {value}
      </span>
    </div>
  );
}

// ── Gallery tab pill ─────────────────────────────────────────────────────────
function ViewPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.3rem 0.75rem",
        fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--paper)" : "var(--ink-2)",
        border: `1px solid ${active ? "var(--ink)" : "var(--rule)"}`,
        borderRadius: "2px",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
      }}
    >
      {label}
    </button>
  );
}

export default function ProductDetail({ photo }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);

  const [selectedProduct, setSelectedProduct] = useState<ProductType>(photo.availableProducts[0]);
  const [personalisation, setPersonalisation] = useState("");
  const [added, setAdded] = useState(false);
  const [galleryView, setGalleryView] = useState<GalleryView>("photo");

  const currentPrice = photo.prices[selectedProduct];
  const isPostcard = selectedProduct === "postcard_a6";
  const isPortrait = photo.aspectRatio === "2:3";
  const specs = PRODUCT_SPECS[selectedProduct];

  // When the format changes, reset post-add state and stay on current gallery view
  function handleFormatChange(pt: ProductType) {
    setSelectedProduct(pt);
    setAdded(false);
  }

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
  }

  return (
    <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4vw, 2.5rem)" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: isPortrait ? "1fr 1fr" : "1.4fr 1fr", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "start" }}
        className="product-detail-grid"
      >
        {/* ── Left: Gallery ──────────────────────────────────────────────── */}
        <div>
          {/* View toggle pills */}
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.875rem" }}>
            <ViewPill label="Photo" active={galleryView === "photo"} onClick={() => setGalleryView("photo")} />
            <ViewPill label="Preview" active={galleryView === "mockup"} onClick={() => setGalleryView("mockup")} />
            <ViewPill label="Details" active={galleryView === "specs"} onClick={() => setGalleryView("specs")} />
          </div>

          {/* Main display */}
          <div style={{
            borderRadius: "4px", overflow: "hidden",
            background: galleryView === "specs" ? "var(--paper-2)" : "var(--rule-2)",
            border: "1px solid var(--rule-2)",
          }}>
            {galleryView === "photo" && (
              <div style={{ position: "relative", aspectRatio: isPortrait ? "2/3" : "3/2" }}>
                <Image
                  src={photo.displayImageUrl}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {galleryView === "mockup" && (
              <div style={{ aspectRatio: "3/2" }}>
                <ProductMockup
                  imageUrl={photo.displayImageUrl}
                  alt={photo.title}
                  productType={selectedProduct}
                  aspectRatio={photo.aspectRatio}
                  location={photo.location}
                />
              </div>
            )}

            {galleryView === "specs" && (
              <div style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "1.25rem" }}>
                  {PRODUCT_LABELS[selectedProduct]}
                </p>
                <SpecRow label="Size" value={specs.dimensions} />
                <SpecRow label="Material" value={specs.material} />
                <SpecRow label="Details" value={specs.extras} />
                <SpecRow label="Ships in" value={specs.shipping} />
                {isPostcard && (
                  <div style={{ marginTop: "1.25rem", padding: "0.875rem", background: "rgba(22,21,15,0.03)", borderRadius: "3px", border: "1px solid var(--rule-2)" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--ink-2)", lineHeight: 1.6 }}>
                      Add a personal message at checkout — printed on the left half of the postcard back. Maximum 140 characters.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Shot metadata */}
          {galleryView === "photo" && (
            <p style={{ fontSize: "0.75rem", color: "var(--faint)", marginTop: "0.75rem" }}>
              {photo.shotAt}
            </p>
          )}
          {galleryView === "mockup" && (
            <p style={{ fontSize: "0.75rem", color: "var(--faint)", marginTop: "0.75rem" }}>
              Preview is illustrative — final print colours match the original photo.
            </p>
          )}
        </div>

        {/* ── Right: Config ─────────────────────────────────────────────── */}
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
              onChange={handleFormatChange}
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
              <PersonaliseField value={personalisation} onChange={setPersonalisation} />
            </div>
          )}

          {/* Price + CTA */}
          <div style={{ marginTop: "auto", paddingTop: "1.75rem", borderTop: "1px solid var(--rule-2)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "1.75rem", fontWeight: 360, color: "var(--ink)" }}>
                {formatPrice(currentPrice)}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--faint)" }}>
                Ships in {specs.shipping}
              </span>
            </div>

            {added ? (
              /* ── Post-add UI ─────────────────────────────────────── */
              <div>
                <div style={{
                  textAlign: "center", padding: "0.65rem",
                  background: "rgba(63,185,80,0.08)", border: "1px solid rgba(63,185,80,0.22)",
                  borderRadius: "3px", marginBottom: "0.75rem",
                }}>
                  <span style={{ fontSize: "0.8125rem", color: "#3a6b3a", fontWeight: 500 }}>
                    Added to cart ✓
                  </span>
                </div>
                <Link
                  href="/checkout"
                  style={{
                    display: "block", width: "100%", background: "var(--ink)", color: "var(--paper)",
                    textAlign: "center", padding: "0.875rem",
                    fontSize: "0.875rem", fontWeight: 600, borderRadius: "3px",
                    letterSpacing: "0.01em", marginBottom: "0.5rem",
                    boxSizing: "border-box",
                  }}
                >
                  Proceed to checkout →
                </Link>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => setDrawerOpen(true)}
                    style={{
                      flex: 1, padding: "0.65rem",
                      background: "none", border: "1px solid var(--rule)",
                      borderRadius: "3px", fontSize: "0.8125rem",
                      cursor: "pointer", color: "var(--ink-2)",
                      transition: "border-color 0.15s",
                    }}
                  >
                    View cart
                  </button>
                  <button
                    onClick={() => setAdded(false)}
                    style={{
                      flex: 1, padding: "0.65rem",
                      background: "none", border: "1px solid var(--rule)",
                      borderRadius: "3px", fontSize: "0.8125rem",
                      cursor: "pointer", color: "var(--ink-2)",
                      transition: "border-color 0.15s",
                    }}
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                style={{
                  width: "100%", padding: "0.875rem 1.5rem",
                  fontSize: "0.875rem", fontWeight: 600,
                  borderRadius: "3px", border: "none", cursor: "pointer",
                  background: "var(--ink)", color: "var(--paper)",
                  letterSpacing: "0.01em",
                }}
              >
                Add to cart →
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
