import type { Photo, ProductType } from "@/types/catalog";

const DEFAULT_PRICES: Record<ProductType, number> = {
  postcard_a6: 650,
  print_a4_unframed: 2200,
  print_a4_framed: 5500,
  print_a3_unframed: 3500,
  print_a3_framed: 7500,
  sticker_pack: 1200,
};

export const catalog: Photo[] = [
  {
    slug: "vianden-castle-golden-hour",
    title: "Vianden Castle",
    location: "Vianden, Luxembourg",
    description:
      "The old castle from the north ridge. Shot at 07:23 on a clear October morning as the first light crossed the valley. The forest below was still in shadow.",
    shotAt: "October 2025 · 07:23 · 80m altitude",
    displayImageUrl: "/images/shop/vianden-castle.jpg",
    printFileKey: "print-files/vianden-castle-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "print_a4_unframed",
      "print_a4_framed",
      "print_a3_unframed",
      "print_a3_framed",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "grund-blue-hour",
    title: "Grund · Blue Hour",
    location: "Luxembourg City",
    description:
      "The Grund quarter from the plateau edge, 75 metres up, twenty minutes after sunset. The Alzette catches the last colour in the sky. The rest is city light.",
    shotAt: "November 2025 · 18:40 · 75m altitude",
    displayImageUrl: "/images/shop/grund-blue-hour.jpg",
    printFileKey: "print-files/grund-blue-hour-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "print_a4_unframed",
      "print_a4_framed",
      "print_a3_unframed",
      "print_a3_framed",
      "sticker_pack",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "mullerthal-rock-arch",
    title: "Mullerthal · The Arch",
    location: "Müllerthal, Luxembourg",
    description:
      "The sandstone arch from directly above, 40 metres. Mullerthal is ground-level territory for most photographers. From above the geometry is entirely different.",
    shotAt: "September 2025 · 11:10 · 40m altitude",
    displayImageUrl: "/images/shop/mullerthal-arch.jpg",
    printFileKey: "print-files/mullerthal-arch-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "print_a4_unframed",
      "print_a4_framed",
      "print_a3_unframed",
      "print_a3_framed",
      "sticker_pack",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "moselle-vineyard-autumn",
    title: "Moselle · Autumn Vines",
    location: "Remich, Luxembourg",
    description:
      "The vineyard terraces along the Moselle in late October. The vines had turned. The river was flat and grey. The rows from 90 metres look painted.",
    shotAt: "October 2025 · 14:30 · 90m altitude",
    displayImageUrl: "/images/shop/moselle-vines.jpg",
    printFileKey: "print-files/moselle-vines-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "print_a4_unframed",
      "print_a4_framed",
      "print_a3_unframed",
      "print_a3_framed",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "luxembourg-city-skyline",
    title: "The Plateau · City Edge",
    location: "Luxembourg City",
    description:
      "The financial district from the south, 120 metres, on an overcast December morning. The towers sit on the plateau edge with the valley visible below. Quiet.",
    shotAt: "December 2025 · 09:05 · 120m altitude",
    displayImageUrl: "/images/shop/lux-city-skyline.jpg",
    printFileKey: "print-files/lux-city-skyline-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "print_a4_unframed",
      "print_a4_framed",
      "print_a3_unframed",
      "print_a3_framed",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "blueberry-homes-aerial",
    title: "Blueberry Homes · Pattern",
    location: "Bangalore, India",
    description:
      "The residential block from directly overhead, 60 metres. The repeating geometry of rooftops and courtyards. Not Luxembourg — but the drone does not care about borders.",
    shotAt: "May 2026 · 08:15 · 60m altitude",
    displayImageUrl: "/images/shop/blueberry-homes.jpg",
    printFileKey: "print-files/blueberry-homes-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: ["postcard_a6", "print_a4_unframed", "print_a4_framed"],
    prices: DEFAULT_PRICES,
  },
];

export function getPhotoBySlug(slug: string): Photo | undefined {
  return catalog.find((p) => p.slug === slug);
}

export function getCatalogByProductType(
  productType: string | null
): Photo[] {
  if (!productType || productType === "all") return catalog;
  return catalog.filter((p) =>
    p.availableProducts.includes(productType as ProductType)
  );
}

/** Minimum sell price across all available products for a photo */
export function getMinPrice(photo: Photo): number {
  return Math.min(
    ...photo.availableProducts.map((pt) => photo.prices[pt])
  );
}

export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}
