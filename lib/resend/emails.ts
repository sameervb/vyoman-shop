import { Resend } from "resend";
import type { Order, OrderItem } from "@/types/orders";
import { PRODUCT_LABELS } from "@/types/catalog";
import { formatPrice } from "@/lib/catalog";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

const FROM = process.env.RESEND_FROM ?? "shop@vyomanaerials.com";

function orderNumber(id: string) {
  return `VY-${id.slice(0, 6).toUpperCase()}`;
}

function itemLines(items: OrderItem[]): string {
  return items
    .map(
      (item) =>
        `• ${item.photoSlug} — ${PRODUCT_LABELS[item.productType]} (${formatPrice(item.priceCents)})`
    )
    .join("\n");
}

const SHOP_URL = "https://shop.vyomanaerials.com";

export async function sendOrderConfirmation(
  order: Order,
  items: OrderItem[]
): Promise<void> {
  const resend = getResend();
  const orderNum = orderNumber(order.id);
  const trackingUrl = `${SHOP_URL}/track/${order.id}`;

  await resend.emails.send({
    from: `Vyoman Shop <${FROM}>`,
    to: order.customerEmail,
    subject: `Your Vyoman order ${orderNum} is confirmed`,
    text: `
Hi ${order.customerName.split(" ")[0]},

Your order is confirmed.

Order ${orderNum}

${itemLines(items)}

Subtotal: ${formatPrice(order.subtotalCents)}
Shipping: ${formatPrice(order.shippingCents)}
Total: ${formatPrice(order.totalCents)}

Shipping to:
${order.customerName}
${order.shippingAddress.line1}${order.shippingAddress.line2 ? "\n" + order.shippingAddress.line2 : ""}
${order.shippingAddress.city}, ${order.shippingAddress.postalCode}
${order.shippingAddress.country}

Track your order: ${trackingUrl}

We'll email you when your order ships. Usually 3–5 working days to Luxembourg, 5–7 days within the EU.

—
Vyoman · shop.vyomanaerials.com
    `.trim(),
  });
}

export async function sendShippingNotification(
  order: Order,
  items: OrderItem[]
): Promise<void> {
  const resend = getResend();
  const orderNum = orderNumber(order.id);
  const trackingUrl = `${SHOP_URL}/track/${order.id}`;

  await resend.emails.send({
    from: `Vyoman Shop <${FROM}>`,
    to: order.customerEmail,
    subject: `Your Vyoman order ${orderNum} is on its way`,
    text: `
Hi ${order.customerName.split(" ")[0]},

Your order ${orderNum} is on its way.

${order.trackingNumber ? `Carrier tracking: ${order.trackingNumber}` : ""}
${order.trackingUrl ? `Carrier link: ${order.trackingUrl}` : ""}

Track your full order here: ${trackingUrl}

${itemLines(items)}

—
Vyoman · shop.vyomanaerials.com
    `.trim(),
  });
}
