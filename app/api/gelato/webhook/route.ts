import { NextRequest, NextResponse } from "next/server";
import { db, orders } from "@/lib/db";
import { orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendShippingNotification } from "@/lib/resend/emails";
import type { Order, OrderItem } from "@/types/orders";

type GelatoWebhookEvent = {
  event: string;
  order: {
    id: string;
    orderReferenceId: string; // our order UUID
    status: string;
    shipment?: {
      trackingCode: string;
      trackingUrl: string;
    };
  };
};

const GELATO_STATUS_MAP: Record<string, string> = {
  created: "submitted_to_gelato",
  passed_to_production: "in_production",
  produced: "in_production",
  shipped: "shipped",
  delivered: "delivered",
  canceled: "cancelled",
};

export async function POST(req: NextRequest) {
  try {
    const event: GelatoWebhookEvent = await req.json();

    // Find our order by Gelato's order reference (which we set to our UUID)
    const orderId = event.order.orderReferenceId;
    const gelatoStatus = event.order.status;
    const internalStatus = GELATO_STATUS_MAP[gelatoStatus];

    if (!internalStatus) {
      // Unknown status — log and acknowledge
      console.log(`[gelato-webhook] unknown status: ${gelatoStatus}`);
      return NextResponse.json({ received: true });
    }

    const updateData: Record<string, unknown> = {
      status: internalStatus,
      updatedAt: new Date(),
    };

    if (event.order.shipment) {
      updateData.trackingNumber = event.order.shipment.trackingCode;
      updateData.trackingUrl = event.order.shipment.trackingUrl;
    }

    await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, orderId));

    // Send shipping email when order ships
    if (gelatoStatus === "shipped") {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      if (order) {
        try {
          await sendShippingNotification(
            order as unknown as Order,
            items as unknown as OrderItem[]
          );
        } catch (err) {
          console.error("[gelato-webhook] shipping email failed:", err);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[gelato-webhook] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
