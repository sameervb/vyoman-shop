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

export type ProductSpec = {
  dimensions: string;
  material: string;
  extras: string;
  shipping: string;
};

export const PRODUCT_SPECS: Record<ProductType, ProductSpec> = {
  postcard_a6: {
    dimensions: "148 × 105 mm (A6 landscape)",
    material: "350 gsm silk coated card",
    extras: "Blank back · address space · message field",
    shipping: "3–5 working days",
  },
  matte_poster: {
    dimensions: "30 × 45 cm (12 × 18 in)",
    material: "200 gsm uncoated matte paper",
    extras: "Ships rolled in protective tube",
    shipping: "3–5 working days",
  },
  framed_print: {
    dimensions: "30 × 40 cm (12 × 16 in)",
    material: "200 gsm paper · black wood frame · plexiglass front",
    extras: "Ready to hang · D-ring hardware included",
    shipping: "5–7 working days",
  },
  canvas: {
    dimensions: "40 × 60 cm (16 × 24 in)",
    material: "Gallery-wrapped canvas · slim wood stretcher",
    extras: "2 cm gallery wrap depth · ready to hang",
    shipping: "5–7 working days",
  },
  mug: {
    dimensions: "10 oz slim · 95 mm tall · 300 ml",
    material: "White porcelain · sublimation ink",
    extras: "Dishwasher safe · microwave safe",
    shipping: "3–5 working days",
  },
  tote_bag: {
    dimensions: "38 × 42 cm · 6 L capacity",
    material: "Natural canvas · screen printed",
    extras: "Machine washable · 10 kg load · short handles",
    shipping: "3–5 working days",
  },
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
