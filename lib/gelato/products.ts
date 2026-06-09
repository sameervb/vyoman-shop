import type { FrameOption, ProductType } from "@/types/catalog";

/**
 * Gelato product UIDs — verify against Gelato catalog API before go-live.
 * https://dashboard.gelato.com/products
 */
export const GELATO_PRODUCT_UIDS: Record<ProductType, string> = {
  postcard_a6:
    "cards_pf_a6_pt_350-gsm-gloss-coated_cl_4-4_hor",
  print_a4_unframed:
    "poster_pf_a4_pt_170-gsm-enhanced-matte_cl_4-0",
  print_a4_framed:
    "framed_poster_pf_a4_pt_170gsm_cl_4-0_fr_black", // default; override with frame option
  print_a3_unframed:
    "poster_pf_a3_pt_170-gsm-enhanced-matte_cl_4-0",
  print_a3_framed:
    "framed_poster_pf_a3_pt_170gsm_cl_4-0_fr_black", // default
  sticker_pack:
    "sticker_pf_60x60_pt_gloss-uv_cl_4-0",
};

export const GELATO_FRAMED_VARIANTS: Partial<
  Record<ProductType, Record<FrameOption, string>>
> = {
  print_a4_framed: {
    black: "framed_poster_pf_a4_pt_170gsm_cl_4-0_fr_black",
    white: "framed_poster_pf_a4_pt_170gsm_cl_4-0_fr_white",
  },
  print_a3_framed: {
    black: "framed_poster_pf_a3_pt_170gsm_cl_4-0_fr_black",
    white: "framed_poster_pf_a3_pt_170gsm_cl_4-0_fr_white",
  },
};

export function getGelatoProductUid(
  productType: ProductType,
  frameOption?: FrameOption
): string {
  if (
    frameOption &&
    (productType === "print_a4_framed" || productType === "print_a3_framed")
  ) {
    return GELATO_FRAMED_VARIANTS[productType]?.[frameOption] ??
      GELATO_PRODUCT_UIDS[productType];
  }
  return GELATO_PRODUCT_UIDS[productType];
}

/** How many Gelato line items to create for each product type */
export function getGelatoQuantity(productType: ProductType): number {
  if (productType === "sticker_pack") return 5; // 5 stickers per pack
  return 1;
}
