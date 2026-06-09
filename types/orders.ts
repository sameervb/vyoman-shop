import type { FrameOption, ProductType } from "./catalog";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "submitted_to_gelato"
  | "in_production"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2
};

export type Order = {
  id: string;
  stripePaymentIntentId: string;
  stripeCheckoutSessionId?: string;
  gelatoOrderId?: string;
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  photoSlug: string;
  productType: ProductType;
  frameOption?: FrameOption;
  personalisation?: string;
  gelatoProductId: string;
  priceCents: number;
  gelatoFileUrl?: string;
};

export type CheckoutRequest = {
  items: Array<{
    photoSlug: string;
    productType: ProductType;
    frameOption?: FrameOption;
    personalisation?: string;
  }>;
  customerEmail: string;
  customerName: string;
  shippingAddress: ShippingAddress;
};

export type CheckoutResponse = {
  clientSecret: string;
  orderId: string;
  shippingCents: number;
  totalCents: number;
};
