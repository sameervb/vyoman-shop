import type { Photo, ProductType } from "@/types/catalog";

const R2 = "https://shop-assets.vyomanaerials.com";

const DEFAULT_PRICES: Record<ProductType, number> = {
  postcard_a6: 800,     // €8.00
  matte_poster: 2800,   // €28.00
  framed_print: 6900,   // €69.00
  canvas: 7500,         // €75.00
  mug: 2200,            // €22.00
  tote_bag: 2800,       // €28.00
};

export const catalog: Photo[] = [
  // ── Storm Over the Sûre — Upper Sûre / Éislek, June 2026 ──────────────────

  {
    slug: "esch-sur-sure-meander",
    title: "Esch-sur-Sûre · The Island Village",
    location: "Esch-sur-Sûre, Luxembourg",
    description:
      "The village sits inside a bend of the Sûre so tight it is almost an island. One road in, one road out. From 80 metres the geometry becomes obvious.",
    shotAt: "June 2026 · 80m altitude · Esch-sur-Sûre",
    displayImageUrl: `${R2}/photos/esch-sur-sure-meander.jpg`,
    printFileKey: "print-files/esch-sur-sure-meander-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
      "framed_print",
      "canvas",
      "mug",
      "tote_bag",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "eislek-rainbow",
    title: "Éislek · After the Storm",
    location: "Éislek Plateau, Luxembourg",
    description:
      "A full arc over the Éislek plateau, twenty minutes after rain. The hills were still wet. The light lasted about four minutes.",
    shotAt: "June 2026 · 90m altitude · Éislek",
    displayImageUrl: `${R2}/photos/eislek-rainbow.jpg`,
    printFileKey: "print-files/eislek-rainbow-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
      "framed_print",
      "canvas",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "haute-sure-viaduct",
    title: "Upper Sûre · The Viaduct",
    location: "Lac de la Haute-Sûre, Luxembourg",
    description:
      "The concrete viaduct curves over an arm of the Upper Sûre reservoir. Roads in Luxembourg often solve geography this way — quietly, and at some scale.",
    shotAt: "June 2026 · 100m altitude · Upper Sûre",
    displayImageUrl: `${R2}/photos/haute-sure-viaduct.jpg`,
    printFileKey: "print-files/haute-sure-viaduct-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
      "framed_print",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "haute-sure-lake",
    title: "Upper Sûre · Before the Break",
    location: "Lac de la Haute-Sûre, Luxembourg",
    description:
      "The reservoir in the gap between storm and clearing. That particular grey-green the water turns when the sky hasn't decided yet.",
    shotAt: "June 2026 · 70m altitude · Upper Sûre",
    displayImageUrl: `${R2}/photos/haute-sure-lake.jpg`,
    printFileKey: "print-files/haute-sure-lake-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
      "framed_print",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "esch-sur-sure-castle",
    title: "Esch-sur-Sûre · Castle and Bridge",
    location: "Esch-sur-Sûre, Luxembourg",
    description:
      "The ruined keep above the village, the river and the old stone bridge below. The castle is twelfth century. The bridge is newer. The rest looks the same.",
    shotAt: "June 2026 · 80m altitude · Esch-sur-Sûre",
    displayImageUrl: `${R2}/photos/esch-sur-sure-castle.jpg`,
    printFileKey: "print-files/esch-sur-sure-castle-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "esch-sur-sure-tower-top",
    title: "Esch-sur-Sûre · Down to the Tower",
    location: "Esch-sur-Sûre, Luxembourg",
    description:
      "Straight down onto the watchtower observation platform. Visitors on the deck at the moment of the shot — scale reference, accidental.",
    shotAt: "June 2026 · 60m altitude · Esch-sur-Sûre",
    displayImageUrl: `${R2}/photos/esch-sur-sure-tower-top.jpg`,
    printFileKey: "print-files/esch-sur-sure-tower-top-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "framed_print",
      "mug",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "sure-rainbow-vertical",
    title: "Upper Sûre · Standing Rainbow",
    location: "Haute-Sûre, Luxembourg",
    description:
      "The same storm, different angle. The rainbow stands above the Upper Sûre valley like something built there.",
    shotAt: "June 2026 · 90m altitude · Upper Sûre",
    displayImageUrl: `${R2}/photos/sure-rainbow-vertical.jpg`,
    printFileKey: "print-files/sure-rainbow-vertical-300dpi.jpg",
    aspectRatio: "2:3",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
    ],
    prices: DEFAULT_PRICES,
  },

  // ── Spring Awakening — Luxembourg / Ardennes, April 2026 ───────────────────

  {
    slug: "river-meander",
    title: "Ardennes · River Geometry",
    location: "Ardennes, Luxembourg",
    description:
      "A meander photographed from directly above at low altitude. The pattern repeats for kilometres in either direction. From the ground it is just a river.",
    shotAt: "April 2026 · 80m altitude · Ardennes",
    displayImageUrl: `${R2}/photos/river-meander.jpg`,
    printFileKey: "print-files/river-meander-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
      "framed_print",
      "canvas",
      "mug",
      "tote_bag",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "countryside-panorama",
    title: "Luxembourg · Patchwork Fields",
    location: "Luxembourg, Spring 2026",
    description:
      "Patchwork fields in the first week of April. The ground is still patchy from winter. Seen from 100 metres the seams between fields become the subject.",
    shotAt: "April 2026 · 100m altitude · Luxembourg",
    displayImageUrl: `${R2}/photos/countryside-panorama.jpg`,
    printFileKey: "print-files/countryside-panorama-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
      "framed_print",
      "canvas",
      "tote_bag",
    ],
    prices: DEFAULT_PRICES,
  },
  {
    slug: "village-hills",
    title: "Luxembourg · Spring Village",
    location: "Luxembourg, Spring 2026",
    description:
      "A small Luxembourg village on the spring slope. The hedgerows are out. The church tower is dead centre. This was not planned.",
    shotAt: "April 2026 · 90m altitude · Luxembourg",
    displayImageUrl: `${R2}/photos/village-hills.jpg`,
    printFileKey: "print-files/village-hills-300dpi.jpg",
    aspectRatio: "3:2",
    availableProducts: [
      "postcard_a6",
      "matte_poster",
      "framed_print",
    ],
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
