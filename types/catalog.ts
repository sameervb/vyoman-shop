export type ProductType =
  | "postcard_a6"
  | "matte_poster"
  | "framed_print"
  | "canvas"
  | "mug"
  | "tote_bag";

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
  postcard_a6: "Postcard A6",
  matte_poster: "Matte Poster · 30×45 cm",
  framed_print: "Framed Print · 30×40 cm",
  canvas: "Canvas · 40×60 cm",
  mug: "Mug · 10 oz",
  tote_bag: "Tote Bag",
};

export const PRODUCT_DESCRIPTIONS: Record<ProductType, string> = {
  postcard_a6:
    "A6 · 350 gsm silk coated. Blank back — add a personal message at checkout.",
  matte_poster:
    "30×45 cm · 200 gsm uncoated matte. Ships rolled in a protective tube.",
  framed_print:
    "30×40 cm · 200 gsm uncoated, black wood frame with plexiglass. Ready to hang.",
  canvas:
    "40×60 cm · gallery-wrapped canvas, slim wood frame. Ready to hang.",
  mug: "10 oz slim porcelain mug. Dishwasher safe.",
  tote_bag: "Standard tote, natural canvas, black print. 38×42 cm.",
};
