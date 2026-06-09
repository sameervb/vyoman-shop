import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import type { ShippingAddress } from "@/types/orders";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique().notNull(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id").unique(),
  gelatoOrderId: text("gelato_order_id").unique(),
  status: text("status", {
    enum: [
      "pending_payment",
      "paid",
      "submitted_to_gelato",
      "in_production",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
  })
    .default("pending_payment")
    .notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  shippingAddress: jsonb("shipping_address").$type<ShippingAddress>().notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  currency: text("currency").default("EUR").notNull(),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  photoSlug: text("photo_slug").notNull(),
  productType: text("product_type").notNull(),
  frameOption: text("frame_option"),
  personalisation: text("personalisation"),
  gelatoProductId: text("gelato_product_id").notNull(),
  priceCents: integer("price_cents").notNull(),
  gelatoFileUrl: text("gelato_file_url"),
});

export type OrderRecord = typeof orders.$inferSelect;
export type NewOrderRecord = typeof orders.$inferInsert;
export type OrderItemRecord = typeof orderItems.$inferSelect;
export type NewOrderItemRecord = typeof orderItems.$inferInsert;
