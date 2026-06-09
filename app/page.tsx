import Image from "next/image";
import Link from "next/link";
import { catalog, getMinPrice, formatPrice } from "@/lib/catalog";

// Pick 3 featured photos — first 3 in the catalog
const featured = catalog.slice(0, 3);

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden bg-[#0a0a0a]">
        {catalog[0] && (
          <Image
            src={catalog[0].displayImageUrl}
            alt="Luxembourg from above"
            fill
            priority
            className="object-cover opacity-80"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute bottom-10 left-8 sm:left-12">
          <p className="text-xs tracking-[0.3em] text-[#f5f5f5]/60 uppercase mb-2">
            Luxembourg · From Above
          </p>
          <h1 className="text-2xl sm:text-3xl font-light text-[#f5f5f5] leading-tight max-w-md">
            Original aerial photography.
            <br />
            Print for your wall.
          </h1>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-xs font-medium tracking-[0.2em] text-[#888888] uppercase mb-8">
          Featured
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((photo) => (
            <Link
              key={photo.slug}
              href={`/product/${photo.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/2] rounded overflow-hidden bg-[#1a1a1a]">
                <Image
                  src={photo.displayImageUrl}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-3">
                <p className="text-sm text-[#f5f5f5]">{photo.title}</p>
                <p className="text-xs text-[#888888] mt-0.5">{photo.location}</p>
                <p className="text-xs text-[#d4a853] mt-1.5">
                  from {formatPrice(getMinPrice(photo))}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="text-sm text-[#888888] hover:text-[#f5f5f5] transition-colors"
          >
            View all photographs →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#2a2a2a] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-medium tracking-[0.2em] text-[#888888] uppercase mb-10 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { n: "01", label: "Choose a photograph" },
              { n: "02", label: "Pick your format" },
              { n: "03", label: "Add a message (optional)" },
              { n: "04", label: "We print and ship to you" },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <p className="text-2xl font-light text-[#2a2a2a] mb-2">
                  {step.n}
                </p>
                <p className="text-sm text-[#888888] leading-snug">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
