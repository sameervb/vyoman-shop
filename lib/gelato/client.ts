import type { Order, OrderItem } from "@/types/orders";
import { getGelatoProductUid, getGelatoQuantity, type PrintOrientation } from "./products";
import { getPhotoBySlug } from "@/lib/catalog";

const GELATO_API_BASE = "https://order.gelatoapis.com";

function gelatoHeaders() {
  return {
    "Content-Type": "application/json",
    "X-API-KEY": process.env.GELATO_API_KEY!,
  };
}

export type GelatoQuoteRequest = {
  country: string; // ISO 3166-1 alpha-2
  items: Array<{
    productType: string;
    quantity: number;
  }>;
};

export type GelatoQuoteResponse = {
  shippingCents: number;
  estimatedDays: number;
};

/**
 * Get a shipping cost estimate from Gelato.
 */
export async function getShippingQuote(
  req: GelatoQuoteRequest
): Promise<GelatoQuoteResponse> {
  // Gelato quote endpoint — adapt to actual API shape
  const response = await fetch(`${GELATO_API_BASE}/v3/quotes`, {
    method: "POST",
    headers: gelatoHeaders(),
    body: JSON.stringify({
      shipmentMethodUid: "standard",
      recipient: { country: req.country },
      products: req.items.map((item) => ({
        productUid: item.productType,
        quantity: item.quantity,
      })),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gelato quote failed: ${response.status} — ${text}`);
  }

  const data = await response.json();

  // Adapt to Gelato's actual response shape — adjust field names as needed
  const shippingPriceCents = Math.round(
    (data.shipmentMethods?.[0]?.price ?? 500) * 100
  );
  const estimatedDays = data.shipmentMethods?.[0]?.estimatedDeliveryDays ?? 5;

  return { shippingCents: shippingPriceCents, estimatedDays };
}

/**
 * Place a fulfillment order with Gelato.
 */
export async function placeGelatoOrder(
  order: Order,
  items: OrderItem[],
  getFileUrl: (item: OrderItem) => Promise<{ front: string; back?: string }>
): Promise<{ gelatoOrderId: string }> {
  const firstName = order.customerName.split(" ")[0];
  const lastName = order.customerName.split(" ").slice(1).join(" ") || firstName;

  const gelatoItems = await Promise.all(
    items.map(async (item) => {
      const { front, back } = await getFileUrl(item);
      const files =
        back
          ? [
              { type: "front", url: front },
              { type: "back", url: back },
            ]
          : [{ type: "default", url: front }];

      const photo = getPhotoBySlug(item.photoSlug);
      const orientation: PrintOrientation =
        photo?.aspectRatio === "2:3" ? "portrait" : "landscape";

      return {
        itemReferenceId: item.id,
        productUid: getGelatoProductUid(item.productType, orientation),
        files,
        quantity: getGelatoQuantity(item.productType),
      };
    })
  );

  const response = await fetch(`${GELATO_API_BASE}/v3/orders`, {
    method: "POST",
    headers: gelatoHeaders(),
    body: JSON.stringify({
      orderReferenceId: order.id,
      customerReferenceId: order.customerEmail,
      currency: "EUR",
      items: gelatoItems,
      shipmentMethodUid: "standard",
      shippingAddress: {
        firstName,
        lastName,
        addressLine1: order.shippingAddress.line1,
        addressLine2: order.shippingAddress.line2 ?? "",
        city: order.shippingAddress.city,
        postCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country,
        email: order.customerEmail,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Gelato order placement failed: ${response.status} — ${text}`
    );
  }

  const data = await response.json();
  return { gelatoOrderId: data.id };
}
