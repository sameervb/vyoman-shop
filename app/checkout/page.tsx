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
    // On success, Stripe redirects to return_url
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded px-4 py-3">
          {error}
        </p>
      )}

      <div className="pt-4 border-t border-[#2a2a2a] space-y-2 text-sm">
        <div className="flex justify-between text-[#888888]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-[#888888]">
          <span>Shipping</span>
          <span>{formatPrice(shippingCents)}</span>
        </div>
        <div className="flex justify-between text-[#f5f5f5] font-medium pt-1">
          <span>Total</span>
          <span>{formatPrice(totalCents)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={paying || !stripe || !elements}
        className="w-full bg-[#d4a853] hover:bg-[#c49843] disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0a0a] text-sm font-semibold py-3.5 rounded transition-colors"
      >
        {paying ? "Processing…" : `Pay ${formatPrice(totalCents)} →`}
      </button>
    </form>
  );
}

// ── Shipping + contact fields ────────────────────────────────────
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

function ShippingFields({
  data,
  onChange,
}: {
  data: ShippingData;
  onChange: (data: ShippingData) => void;
}) {
  const field = (name: keyof ShippingData, label: string, required = true, type = "text") => (
    <div>
      <label className="block text-xs text-[#888888] mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={data[name]}
        onChange={(e) => onChange({ ...data, [name]: e.target.value })}
        autoComplete={name === "email" ? "email" : name === "line1" ? "address-line1" : name === "line2" ? "address-line2" : name === "city" ? "address-level2" : name === "postalCode" ? "postal-code" : name === "country" ? "country" : "off"}
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#d4a853] transition-colors"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-3">
          Contact
        </h2>
        {field("email", "Email address", true, "email")}
      </div>

      <div>
        <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-3 mt-6">
          Shipping address
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {field("firstName", "First name")}
          {field("lastName", "Last name")}
        </div>
        <div className="mt-3">{field("line1", "Address")}</div>
        <div className="mt-3">{field("line2", "Apartment, suite (optional)", false)}</div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {field("city", "City")}
          {field("postalCode", "Postal code")}
        </div>
        <div className="mt-3">
          <label className="block text-xs text-[#888888] mb-1.5">Country</label>
          <select
            value={data.country}
            onChange={(e) => onChange({ ...data, country: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#d4a853] transition-colors"
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
    email: "",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "LU",
  });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingCents, setShippingCents] = useState(0);
  const [totalCents, setTotalCents] = useState(subtotalCents);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect if cart is empty
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-lg font-light text-[#f5f5f5] mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div>
          {!clientSecret ? (
            <form onSubmit={handleContinueToPayment} className="space-y-6">
              <ShippingFields data={shipping} onChange={setShipping} />

              {formError && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded px-4 py-3">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4a853] hover:bg-[#c49843] disabled:opacity-50 text-[#0a0a0a] text-sm font-semibold py-3.5 rounded transition-colors mt-4"
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
                  theme: "night",
                  variables: {
                    colorPrimary: "#d4a853",
                    colorBackground: "#1a1a1a",
                    colorText: "#f5f5f5",
                    colorDanger: "#f85149",
                    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
                    borderRadius: "4px",
                  },
                },
              }}
            >
              <CheckoutForm
                orderId={orderId!}
                totalCents={totalCents}
                shippingCents={shippingCents}
              />
            </Elements>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="lg:pl-8 lg:border-l lg:border-[#2a2a2a]">
          <h2 className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-6">
            Order summary
          </h2>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4">
                <div className="relative w-14 h-10 rounded overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.photoDisplayUrl}
                    alt={item.photoTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f5f5f5] truncate">
                    {item.photoTitle}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {PRODUCT_LABELS[item.productType]}
                  </p>
                </div>
                <span className="text-sm text-[#f5f5f5] flex-shrink-0">
                  {formatPrice(item.priceCents)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-[#2a2a2a] space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#888888]">Subtotal</span>
              <span className="text-[#f5f5f5]">{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Shipping</span>
              <span className="text-[#888888]">
                {shippingCents > 0 ? formatPrice(shippingCents) : "Calculated next step"}
              </span>
            </div>
            {totalCents > subtotalCents && (
              <div className="flex justify-between font-medium pt-1 border-t border-[#2a2a2a]">
                <span className="text-[#f5f5f5]">Total</span>
                <span className="text-[#f5f5f5]">{formatPrice(totalCents)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
