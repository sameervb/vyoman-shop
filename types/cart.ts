import type { FrameOption, ProductType } from "./catalog";

export type CartItem = {
  id: string; // client-generated uuid
  photoSlug: string;
  photoTitle: string;
  photoDisplayUrl: string;
  productType: ProductType;
  frameOption?: FrameOption;
  personalisation?: string; // postcard message, max 140 chars
  priceCents: number;
};
