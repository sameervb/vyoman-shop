import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Vyoman Shop",
  description: "Original aerial photography of Luxembourg, printed and shipped from Europe.",
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 2.5rem) 4rem" }}>
      <p style={{ fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, color: "var(--faint)", marginBottom: "0.85rem" }}>
        About
      </p>
      <h1 style={{
        fontFamily: "'Fraunces', Georgia, serif", fontWeight: 360,
        fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.01em",
        color: "var(--ink)", marginBottom: "2.5rem",
      }}>
        Aerial photography of Luxembourg.
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {[
          "Vyoman is an aerial photography project based in Luxembourg. The name is from Sanskrit — it means sky.",
          "Everything in this shop was shot on a DJI Mini 5 Pro, flown under EASA Open Category regulations across Luxembourg and the surrounding region. The images are 50-megapixel stills, not video frames. They hold at A3 and beyond.",
          "The shop uses print-on-demand fulfilment via Gelato, a European print network. Your order is printed and shipped from a facility close to you — usually within 3–5 working days to Luxembourg, or 5–7 days elsewhere in the EU.",
          "No stock is ever held. Each piece is printed when you order it.",
        ].map((text, i) => (
          <p key={i} style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--ink-2)" }}>
            {text}
          </p>
        ))}
      </div>

      <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--rule-2)", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
        <a
          href="https://vyomanaerials.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.875rem", color: "var(--ink)", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          See the full portfolio →
        </a>
        <a
          href="mailto:shop@vyomanaerials.com"
          style={{ fontSize: "0.875rem", color: "var(--faint)", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          Get in touch
        </a>
        <Link
          href="/shop"
          style={{ fontSize: "0.875rem", color: "var(--faint)", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          Browse the collection
        </Link>
      </div>
    </div>
  );
}
