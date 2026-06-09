import { catalog } from "@/lib/catalog";
import ProductGrid from "@/components/shop/ProductGrid";

export const metadata = {
  title: "Shop · Vyoman",
  description: "Original aerial photography of Luxembourg — postcards, prints, canvas, mugs, and totes. Shipped from Europe.",
};

export default function ShopPage() {
  return (
    <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 4vw, 2.5rem)" }}>
      {/* Header */}
      <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.85rem" }}>
          Vyoman · Shop
        </p>
        <h1 style={{
          fontFamily: "'Fraunces', Georgia, serif", fontWeight: 380,
          fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.015em", lineHeight: 1.05,
          color: "var(--ink)", maxWidth: "18ch",
        }}>
          Luxembourg, from above.
        </h1>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--ink-2)", maxWidth: "42ch", lineHeight: 1.65 }}>
          {catalog.length} photographs. Postcards, prints, canvas, mugs, and totes. Every frame shot on a DJI Mini 5 Pro over Luxembourg.
        </p>
      </div>

      <ProductGrid photos={catalog} />
    </div>
  );
}
