import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { db, orders, orderItems } from "@/lib/db";
import { getShippingQuote } from "@/lib/gelato/client";
import { getGelatoProductUid } from "@/lib/gelato/products";
import { getPhotoBySlug } from "@/lib/catalog";
import type { CheckoutRequest } from "@/types/orders";

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequest = await req.json();

    // Validate items against catalog
    const validatedItems = [];
    let subtotalCents = 0;

    for (const item of body.items) {
      const photo = getPhotoBySlug(item.photoSlug);
      if (!photo) {
        return NextResponse.json(
          { error: `Photo not found: ${item.photoSlug}` },
          { status: 400 }
        );
      }
      if (!photo.availableProducts.includes(item.productType)) {
        return NextResponse.json(
          { error: `Product type ${item.productType} not available for ${item.photoSlug}` },
          { status: 400 }
        );
      }

      const priceCents = photo.prices[item.productType];
      subtotalCents += priceCents;

      validatedItems.push({
        ...item,
        priceCents,
        gelatoProductId: getGelatoProductUid(item.productType, item.frameOption),
      });
    }

    // Get Gelato shipping quote
    let shippingCents = 0;
    try {
      const quote = await getShippingQuote({
        country: body.shippingAddress.country,
        items: validatedItems.map((item) => ({
          productType: item.gelatoProductId,
          quantity: 1,
        })),
      });
      shippingCents = quote.shippingCents;
    } catch {
      // Fallback shipping estimate if Gelato quote fails
      shippingCents = body.shippingAddress.country === "LU" ? 250 : 600;
    }

    const totalCents = subtotalCents + shippingCents;

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        customerEmail: body.customerEmail,
        customerName: body.customerName,
      },
    });

    // Create order in DB
    const [order] = await db
      .insert(orders)
      .values({
        stripePaymentIntentId: paymentIntent.id,
        customerEmail: body.customerEmail,
        customerName: body.customerName,
        shippingAddress: body.shippingAddress,
        subtotalCents,
        shippingCents,
        totalCents,
        currency: "EUR",
        status: "pending_payment",
      })
      .returning();

    // Create order items
    await db.insert(orderItems).values(
      validatedItems.map((item) => ({
        orderId: order.id,
        photoSlug: item.photoSlug,
        productType: item.productType,
        frameOption: item.frameOption,
        personalisation: item.personalisation,
        gelatoProductId: item.gelatoProductId,
        priceCents: item.priceCents,
      }))
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      shippingCents,
      totalCents,
    });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
