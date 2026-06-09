import { notFound } from "next/navigation";
import Link from "next/link";
import { db, orders, orderItems } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getPhotoBySlug, formatPrice } from "@/lib/catalog";
import { PRODUCT_LABELS } from "@/types/catalog";
import type { OrderRecord, OrderItemRecord } from "@/lib/db/schema";

interface Props {
  params: Promise<{ orderId: string }>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function orderNumber(id: string) {
  return `VY-${id.slice(0, 6).toUpperCase()}`;
}

type OrderStatus = OrderRecord["status"];

// Each stage is "done" when the order has reached or passed it
const STATUS_STAGES: { label: string; done: readonly OrderStatus[] }[] = [
  {
    label: "Order received",
    done: [
      "pending_payment",
      "paid",
      "submitted_to_gelato",
      "in_production",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
  },
  {
    label: "Payment confirmed",
    done: ["paid", "submitted_to_gelato", "in_production", "shipped", "delivered", "refunded"],
  },
  {
    label: "In production",
    done: ["in_production", "shipped", "delivered"],
  },
  {
    label: "Shipped",
    done: ["shipped", "delivered"],
  },
  {
    label: "Delivered",
    done: ["delivered"],
  },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  paid: "Payment confirmed",
  submitted_to_gelato: "Sent to print",
  in_production: "In production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StageRow({
  label,
  done,
  active,
  isLast,
  trackingUrl,
  trackingNumber,
}: {
  label: string;
  done: boolean;
  active: boolean;
  isLast: boolean;
  trackingUrl?: string | null;
  trackingNumber?: string | null;
}) {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {/* Icon column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: "20px", height: "20px", borderRadius: "50%",
          border: `1.5px solid ${done ? "var(--ink)" : "var(--rule)"}`,
          background: done ? "var(--ink)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {done && (
            <svg width="10" height="10" fill="none" stroke="var(--paper)" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
        {!isLast && (
          <div style={{
            width: "1.5px", flex: 1, minHeight: "24px",
            background: done ? "var(--ink)" : "var(--rule-2)",
            marginTop: "3px",
          }} />
        )}
      </div>

      {/* Label column */}
      <div style={{ paddingBottom: isLast ? "0" : "1.5rem" }}>
        <p style={{
          fontSize: "0.875rem",
          fontWeight: active ? 600 : 400,
          color: done ? "var(--ink)" : "var(--faint)",
          lineHeight: 1.35,
          marginTop: "1px",
        }}>
          {label}
        </p>
        {label === "Shipped" && done && (trackingNumber || trackingUrl) && (
          <div style={{ marginTop: "0.35rem" }}>
            {trackingNumber && (
              <p style={{ fontSize: "0.75rem", color: "var(--ink-2)", fontFamily: "monospace" }}>
                {trackingNumber}
              </p>
            )}
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.75rem", color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "2px" }}
              >
                Track shipment →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemRow({ item }: { item: OrderItemRecord }) {
  const photo = getPhotoBySlug(item.photoSlug);
  const title = photo?.title ?? item.photoSlug;
  const label = PRODUCT_LABELS[item.productType as keyof typeof PRODUCT_LABELS] ?? item.productType;

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "0.875rem 0", borderBottom: "1px solid var(--rule-2)", gap: "1rem",
    }}>
      <div>
        <p style={{ fontSize: "0.875rem", color: "var(--ink)", fontWeight: 500 }}>{title}</p>
        <p style={{ fontSize: "0.75rem", color: "var(--ink-2)", marginTop: "0.2rem" }}>{label}</p>
        {item.personalisation && (
          <p style={{
            fontSize: "0.75rem", color: "var(--faint)", marginTop: "0.35rem",
            fontStyle: "italic",
          }}>
            &ldquo;{item.personalisation}&rdquo;
          </p>
        )}
      </div>
      <span style={{ fontSize: "0.875rem", color: "var(--ink)", fontWeight: 500, flexShrink: 0 }}>
        {formatPrice(item.priceCents)}
      </span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function TrackOrderPage({ params }: Props) {
  const { orderId } = await params;

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) notFound();

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const isCancelled = order.status === "cancelled" || order.status === "refunded";
  const activeStage = STATUS_STAGES.findLast((s) => s.done.includes(order.status));

  return (
    <div style={{
      maxWidth: "580px", margin: "0 auto",
      padding: "clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 2.5rem) 4rem",
    }}>
      {/* Header */}
      <p style={{
        fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase",
        fontWeight: 500, color: "var(--faint)", marginBottom: "0.75rem",
      }}>
        Order {orderNumber(order.id)}
      </p>
      <h1 style={{
        fontFamily: "'Fraunces', Georgia, serif", fontWeight: 360,
        fontSize: "clamp(1.6rem, 3vw, 2rem)", letterSpacing: "-0.01em",
        color: "var(--ink)", marginBottom: "0.5rem",
      }}>
        {isCancelled ? STATUS_LABELS[order.status] : "Your order is on its way."}
      </h1>
      <p style={{ fontSize: "0.875rem", color: "var(--ink-2)", marginBottom: "2.5rem" }}>
        {isCancelled
          ? "This order has been cancelled or refunded. Questions? Email shop@vyomanaerials.com."
          : `Status: ${STATUS_LABELS[order.status]}`}
      </p>

      {/* Status timeline */}
      {!isCancelled && (
        <div style={{
          background: "var(--paper-2)", border: "1px solid var(--rule-2)",
          borderRadius: "6px", padding: "1.5rem 1.5rem 1.25rem",
          marginBottom: "2.5rem",
        }}>
          {STATUS_STAGES.map((stage, i) => (
            <StageRow
              key={stage.label}
              label={stage.label}
              done={stage.done.includes(order.status)}
              active={stage === activeStage}
              isLast={i === STATUS_STAGES.length - 1}
              trackingUrl={order.trackingUrl}
              trackingNumber={order.trackingNumber}
            />
          ))}
        </div>
      )}

      {/* Order items */}
      <h2 style={{
        fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase",
        fontWeight: 500, color: "var(--faint)", marginBottom: "0.25rem",
      }}>
        Items
      </h2>
      <div style={{ marginBottom: "2rem" }}>
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Totals */}
      <div style={{
        padding: "1rem 0",
        borderTop: "1px solid var(--rule-2)",
        marginBottom: "2rem",
      }}>
        {[
          { label: "Subtotal", value: formatPrice(order.subtotalCents) },
          { label: "Shipping", value: formatPrice(order.shippingCents) },
          { label: "Total", value: formatPrice(order.totalCents), bold: true },
        ].map(({ label, value, bold }) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "0.875rem", padding: "0.3rem 0",
          }}>
            <span style={{ color: bold ? "var(--ink)" : "var(--ink-2)", fontWeight: bold ? 600 : 400 }}>{label}</span>
            <span style={{ color: "var(--ink)", fontWeight: bold ? 600 : 400 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Shipping address */}
      <h2 style={{
        fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase",
        fontWeight: 500, color: "var(--faint)", marginBottom: "0.75rem",
      }}>
        Shipping to
      </h2>
      <address style={{
        fontStyle: "normal", fontSize: "0.875rem", lineHeight: 1.7,
        color: "var(--ink-2)", marginBottom: "2.5rem",
      }}>
        {order.customerName}<br />
        {order.shippingAddress.line1}<br />
        {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
        {order.shippingAddress.country}
      </address>

      {/* Footer links */}
      <div style={{ borderTop: "1px solid var(--rule-2)", paddingTop: "1.5rem", display: "flex", gap: "1.5rem" }}>
        <Link href="/shop" style={{
          fontSize: "0.875rem", color: "var(--ink)", fontWeight: 500,
          textDecoration: "underline", textUnderlineOffset: "3px",
        }}>
          Continue shopping
        </Link>
        <a href="mailto:shop@vyomanaerials.com" style={{
          fontSize: "0.875rem", color: "var(--faint)",
          textDecoration: "underline", textUnderlineOffset: "3px",
        }}>
          Contact us
        </a>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic"; // always read fresh from DB
