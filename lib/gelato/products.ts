import type { ProductType } from "@/types/catalog";

export type PrintOrientation = "landscape" | "portrait";

/**
 * Gelato product UIDs — verified against Gelato catalog API, June 2026.
 * Landscape-default UIDs listed. postcard_a6 has a separate portrait variant
 * handled in getGelatoProductUid.
 */
export const GELATO_PRODUCT_UIDS: Record<ProductType, string> = {
  postcard_a6:
    "cards_pf_a6_pt_350-gsm-coated-silk_cl_4-4_hor",
  matte_poster:
    "flat_300x450-mm-12x18-inch_200-gsm-80lb-uncoated_4-0_ver",
  framed_print:
    "framed_poster_300x400-mm-12x16-inch_black_wood_w12xt22-mm_plexiglass_300x400-mm-12x16-inch_200-gsm-80lb-uncoated_4-0_hor",
  canvas:
    "canvas_s_product_cf_400x600-mm_cm_canvas_cthck_wood-fsc-slim_cl_4-0_hor",
  mug:
    "mug_product_msz_10-oz-slim_mmat_porcelain-white_cl_4-0",
  tote_bag:
    "bag_product_bsc_tote-bag_bqa_clc_bsi_std-t_bco_black_bpr_0-4",
};

/** Portrait variant of A6 postcard — for 2:3 photos */
const POSTCARD_A6_PORTRAIT_UID =
  "cards_pf_a6_pt_350-gsm-coated-silk_cl_4-4_ver";

export function getGelatoProductUid(
  productType: ProductType,
  orientation: PrintOrientation = "landscape"
): string {
  if (productType === "postcard_a6" && orientation === "portrait") {
    return POSTCARD_A6_PORTRAIT_UID;
  }
  return GELATO_PRODUCT_UIDS[productType];
}

/** One Gelato line item per cart item for all current product types. */
export function getGelatoQuantity(_productType: ProductType): number {
  return 1;
}
