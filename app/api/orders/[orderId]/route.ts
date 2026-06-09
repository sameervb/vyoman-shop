import { NextRequest, NextResponse } from "next/server";
import { db, orders, orderItems } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  // UUID is cryptographically random — it functions as an access token.
  // No auth required: knowledge of the UUID IS the proof of access.
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return NextResponse.json({ order, items });
}
