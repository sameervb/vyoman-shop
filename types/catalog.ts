export type ProductType =
  | "postcard_a6"
  | "print_a4_unframed"
  | "print_a4_framed"
  | "print_a3_unframed"
  | "print_a3_framed"
  | "sticker_pack";

export type FrameOption = "black" | "white";

export type Photo = {
  slug: string;
  title: string;
  location: string;
  description: string;
  shotAt: string;
  displayImageUrl: string;
  printFileKey: string;
  aspectRatio: "3:2" | "2:3";
  availableProducts: ProductType[];
  prices: Record<ProductType, number>; // in cents
};

export const PRODUCT_LABELS: Record<ProductType, string> = {
  postcard_a6: "Postcard (A6)",
  print_a4_unframed: "A4 Print · Unframed",
  print_a4_framed: "A4 Print · Framed",
  print_a3_unframed: "A3 Print · Unframed",
  print_a3_framed: "A3 Print · Framed",
  sticker_pack: "Sticker Pack (5 stickers)",
};

export const PRODUCT_DESCRIPTIONS: Record<ProductType, string> = {
  postcard_a6: "A6 glossy, 300gsm. Add a personal message for the back.",
  print_a4_unframed: "210 × 297mm, 170gsm enhanced matte.",
  print_a4_framed: "210 × 297mm, 170gsm, solid wood frame.",
  print_a3_unframed: "297 × 420mm, 170gsm enhanced matte.",
  print_a3_framed: "297 × 420mm, 170gsm, solid wood frame.",
  sticker_pack: "5 die-cut vinyl stickers, outdoor durable.",
};
