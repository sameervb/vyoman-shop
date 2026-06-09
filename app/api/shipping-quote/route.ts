import { NextRequest, NextResponse } from "next/server";
import { getShippingQuote } from "@/lib/gelato/client";

export async function POST(req: NextRequest) {
  try {
    const { country, items } = await req.json();

    if (!country) {
      return NextResponse.json({ error: "country is required" }, { status: 400 });
    }

    const quote = await getShippingQuote({ country, items: items ?? [] });
    return NextResponse.json(quote);
  } catch (err) {
    console.error("[shipping-quote] error:", err);
    // Return a fallback rather than erroring — checkout can still proceed
    return NextResponse.json({ shippingCents: 600, estimatedDays: 5 });
  }
}
