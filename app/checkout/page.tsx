"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/catalog";
import { PRODUCT_LABELS } from "@/types/catalog";
import type { CheckoutRequest } from "@/types/orders";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ── Checkout form ────────────────────────────────────────────────
function CheckoutForm({
  orderId,
  totalCents,
  shippingCents,
}: {
  orderId: string;
  totalCents: number;
  shippingCents: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subtotalCents = useCartStore((s) => s.subtotalCents());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmed/${orderId}`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed.");
      setPaying(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      {error && (
        <p style={{ fontSize: "0.875rem", color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "3px", padding: "0.75rem 1rem", marginTop: "1rem" }}>
          {error}
        </p>
      )}

      <div style={{ paddingTop: "1.25rem", borderTop: "1px solid var(--rule-2)", marginTop: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.4rem" }}>
          <span style={{ color: "var(--ink-2)" }}>Subtotal</span>
          <span style={{ color: "var(--ink)" }}>{formatPrice(subtotalCents)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "1rem" }}>
          <span style={{ color: "var(--ink-2)" }}>Shipping</span>
          <span style={{ color: "var(--ink)" }}>{formatPrice(shippingCents)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 600, paddingTop: "0.75rem", borderTop: "1px solid var(--rule-2)" }}>
          <span style={{ color: "var(--ink)" }}>Total</span>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)" }}>{formatPrice(totalCents)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={paying || !stripe || !elements}
        style={{
          width: "100%", marginTop: "1.5rem",
          background: paying ? "var(--ink-2)" : "var(--ink)",
          color: "var(--paper)", padding: "0.875rem",
          fontSize: "0.875rem", fontWeight: 600, borderRadius: "3px",
          border: "none", cursor: paying ? "not-allowed" : "pointer",
          transition: "background 0.2s", letterSpacing: "0.01em",
          opacity: paying ? 0.7 : 1,
        }}
      >
        {paying ? "Processing…" : `Pay ${formatPrice(totalCents)} →`}
      </button>
    </form>
  );
}

// ── Shipping fields ───────────────────────────────────────────────
interface ShippingData {
  email: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
}

const inputStyle = {
  width: "100%", background: "var(--paper-2)", border: "1px solid var(--rule)",
  borderRadius: "3px", padding: "0.65rem 0.875rem",
  fontSize: "0.875rem", color: "var(--ink)",
  fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const,
  transition: "border-color 0.15s",
};

const labelStyle = { display: "block", fontSize: "0.75rem", color: "var(--faint)", marginBottom: "0.4rem", fontWeight: 500 };

function ShippingFields({ data, onChange }: { data: ShippingData; onChange: (d: ShippingData) => void }) {
  const f = (name: keyof ShippingData, label: string, required = true, type = "text") => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} required={required}
        value={data[name]}
        onChange={(e) => onChange({ ...data, [name]: e.target.value })}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--rule)")}
      />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.75rem" }}>Contact</p>
        {f("email", "Email address", true, "email")}
      </div>
      <div>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.75rem", marginTop: "0.5rem" }}>Shipping address</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {f("firstName", "First name")}
          {f("lastName", "Last name")}
        </div>
        <div style={{ marginTop: "0.75rem" }}>{f("line1", "Address")}</div>
        <div style={{ marginTop: "0.75rem" }}>{f("line2", "Apartment, suite (optional)", false)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.75rem" }}>
          {f("city", "City")}
          {f("postalCode", "Postal code")}
        </div>
        <div style={{ marginTop: "0.75rem" }}>
          <label style={labelStyle}>Country</label>
          <select
            value={data.country}
            onChange={(e) => onChange({ ...data, country: e.target.value })}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="LU">Luxembourg</option>
            <option value="BE">Belgium</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="NL">Netherlands</option>
            <option value="GB">United Kingdom</option>
            <option value="AT">Austria</option>
            <option value="CH">Switzerland</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="PL">Poland</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ── Main checkout page ────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotalCents = useCartStore((s) => s.subtotalCents());

  const [shipping, setShipping] = useState<ShippingData>({
    email: "", firstName: "", lastName: "",
    line1: "", line2: "", city: "", postalCode: "", country: "LU",
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingCents, setShippingCents] = useState(0);
  const [totalCents, setTotalCents] = useState(subtotalCents);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) router.replace("/shop");
  }, [items.length, router]);

  async function handleContinueToPayment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const body: CheckoutRequest = {
      items: items.map((item) => ({
        photoSlug: item.photoSlug,
        productType: item.productType,
        frameOption: item.frameOption,
        personalisation: item.personalisation,
      })),
      customerEmail: shipping.email,
      customerName: `${shipping.firstName} ${shipping.lastName}`.trim(),
      shippingAddress: {
        line1: shipping.line1,
        line2: shipping.line2 || undefined,
        city: shipping.city,
        postalCode: shipping.postalCode,
        country: shipping.country,
      },
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setFormError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setClientSecret(data.clientSecret);
    setOrderId(data.orderId);
    setShippingCents(data.shippingCents);
    setTotalCents(data.totalCents);
    setLoading(false);
  }

  if (items.length === 0) return null;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "clamp(5rem, 8vw, 7rem) clamp(1.25rem, 4vw, 2.5rem) 4rem" }}>
      <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 360, fontSize: "clamp(1.6rem, 3vw, 2rem)", letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: "2.5rem" }}>
        Checkout
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="checkout-grid">
        {/* Left: Form */}
        <div>
          {!clientSecret ? (
            <form onSubmit={handleContinueToPayment}>
              <ShippingFields data={shipping} onChange={setShipping} />

              {formError && (
                <p style={{ fontSize: "0.875rem", color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "3px", padding: "0.75rem 1rem", marginTop: "1rem" }}>
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", marginTop: "1.75rem",
                  background: "var(--ink)", color: "var(--paper)",
                  padding: "0.875rem", fontSize: "0.875rem", fontWeight: 600,
                  borderRadius: "3px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1, letterSpacing: "0.01em",
                }}
              >
                {loading ? "Getting shipping quote…" : "Continue to payment →"}
              </button>
            </form>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#16150F",
                    colorBackground: "#FAF8F3",
                    colorText: "#16150F",
                    colorTextSecondary: "#5E5A50",
                    colorDanger: "#b91c1c",
                    fontFamily: "'Hanken Grotesk', ui-sans-serif, Arial, sans-serif",
                    borderRadius: "3px",
                  },
                },
              }}
            >
              <CheckoutForm orderId={orderId!} totalCents={totalCents} shippingCents={shippingCents} />
            </Elements>
          )}
        </div>

        {/* Right: Order summary */}
        <div style={{ borderTop: "1px solid var(--rule-2)", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "1.25rem" }}>
            Order summary
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {items.map((item) => (
              <li key={item.id} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                <div style={{ position: "relative", width: "56px", height: "40px", borderRadius: "3px", overflow: "hidden", flexShrink: 0, background: "var(--rule-2)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.photoDisplayUrl} alt={item.photoTitle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.photoTitle}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--ink-2)", marginTop: "0.2rem" }}>
                    {PRODUCT_LABELS[item.productType]}
                  </p>
                </div>
                <span style={{ fontSize: "0.875rem", color: "var(--ink)", flexShrink: 0 }}>
                  {formatPrice(item.priceCents)}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--rule-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "var(--ink-2)" }}>Subtotal</span>
              <span style={{ color: "var(--ink)" }}>{formatPrice(subtotalCents)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--ink-2)" }}>Shipping</span>
              <span style={{ color: "var(--ink-2)" }}>
                {shippingCents > 0 ? formatPrice(shippingCents) : "Calculated next step"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .checkout-grid { grid-template-columns: 1.1fr 0.9fr !important; }
          .checkout-grid > div:last-child { border-top: none !important; padding-top: 0 !important; border-left: 1px solid var(--rule-2); padding-left: 3rem; }
        }
      `}</style>
    </div>
  );
}
