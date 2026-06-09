import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Vyoman Shop",
  description: "Original aerial photography of Luxembourg, printed and shipped from Europe.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-lg font-light text-[#f5f5f5] mb-10">About</h1>

      <div className="space-y-6 text-sm text-[#cccccc] leading-relaxed">
        <p>
          Vyoman is an aerial photography project based in Luxembourg. The name
          is from Sanskrit — it means sky.
        </p>
        <p>
          Everything in this shop was shot on a DJI Mini 5 Pro, flown under EASA
          Open Category regulations across Luxembourg and nearby. The images you
          see are 50-megapixel stills, not video frames. They hold their quality
          at A3 and beyond.
        </p>
        <p>
          The shop uses print-on-demand fulfilment via Gelato, a European print
          network. Your order is printed and shipped from a facility close to
          you — usually within 3–5 working days to Luxembourg or 5–7 days
          elsewhere in the EU.
        </p>
        <p>
          No stock is ever held. Each piece is printed when you order it.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-[#2a2a2a] flex flex-col sm:flex-row gap-4">
        <Link
          href="https://vyomanaerials.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#d4a853] hover:underline"
        >
          See the full portfolio →
        </Link>
        <Link
          href="mailto:hello@vyomanaerials.com"
          className="text-sm text-[#888888] hover:text-[#f5f5f5] transition-colors"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
