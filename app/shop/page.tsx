import { catalog } from "@/lib/catalog";
import ProductGrid from "@/components/shop/ProductGrid";

export const metadata = {
  title: "Shop · Vyoman",
  description: "Postcards, art prints, and sticker packs — original aerial photography of Luxembourg.",
};

export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-lg font-light text-[#f5f5f5] mb-2">Shop</h1>
        <p className="text-sm text-[#888888]">
          {catalog.length} photographs. Postcards, prints, stickers. Shipped from Europe.
        </p>
      </div>
      <ProductGrid photos={catalog} />
    </div>
  );
}
