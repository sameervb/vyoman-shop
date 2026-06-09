import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe/client";
import { db, orders, orderItems } from "@/lib/db";
import { eq } from "drizzle-orm";
import { placeGelatoOrder } from "@/lib/gelato/client";
import { generatePostcardBack } from "@/lib/gelato/postcard";
import { getPhotoBySlug } from "@/lib/catalog";
import { sendOrderConfirmation } from "@/lib/resend/emails";
import type { Order, OrderItem } from "@/types/orders";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    await handlePaymentSuccess(paymentIntent.id);
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    await db
      .update(orders)
      .set({ status: "pending_payment" })
      .where(eq(orders.stripePaymentIntentId, paymentIntent.id));
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntentId: string) {
  // Find the order
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripePaymentIntentId, paymentIntentId))
    .limit(1);

  if (!order || order.status !== "pending_payment") return;

  // Mark as paid
  await db
    .update(orders)
    .set({ status: "paid", updatedAt: new Date() })
    .where(eq(orders.id, order.id));

  // Get order items
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  // Build typed order for downstream functions
  const typedOrder = order as unknown as Order;
  const typedItems = items as unknown as OrderItem[];

  // Send confirmation email
  try {
    await sendOrderConfirmation(typedOrder, typedItems);
  } catch (err) {
    console.error("[stripe-webhook] email failed:", err);
    // Don't fail the webhook — email is non-critical
  }

  // Place Gelato order
  try {
    const { gelatoOrderId } = await placeGelatoOrder(
      typedOrder,
      typedItems,
      async (item) => {
        const photo = getPhotoBySlug(item.photoSlug);
        // Front: use R2 print-resolution file URL
        const front = photo
          ? `${process.env.R2_PUBLIC_URL}/print-files/${item.photoSlug}-300dpi.jpg`
          : "";

        // Back: generate for postcards
        let back: string | undefined;
        if (item.productType === "postcard_a6") {
          const backBuffer = await generatePostcardBack(
            item.personalisation,
            item.photoSlug
          );
          // In production: upload backBuffer to R2 and return signed URL
          // For now, return empty string (Gelato will need a real URL)
          back = await uploadPostcardBack(order.id, item.id, backBuffer);
        }

        return { front, back };
      }
    );

    await db
      .update(orders)
      .set({ gelatoOrderId, status: "submitted_to_gelato", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
  } catch (err) {
    console.error("[stripe-webhook] Gelato order placement failed:", err);
    // Order stays as 'paid' — needs manual follow-up
  }
}

/**
 * Upload postcard back PNG to R2 and return a temporary signed URL.
 * Requires @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner.
 * Stubbed here — wire up when R2 credentials are available.
 */
async function uploadPostcardBack(
  orderId: string,
  itemId: string,
  buffer: Buffer
): Promise<string> {
  // TODO: wire up Cloudflare R2 upload
  // const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  // const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
  // const client = new S3Client({ ... });
  // await client.send(new PutObjectCommand({ Bucket, Key, Body: buffer, ContentType: "image/png" }));
  // return getSignedUrl(client, new GetObjectCommand({ Bucket, Key }), { expiresIn: 172800 });
  console.warn(`[postcard-back] upload stubbed for order ${orderId} item ${itemId}`);
  return "";
}
