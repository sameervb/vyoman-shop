import Link from "next/link";
import Image from "next/image";
import type { Photo } from "@/types/catalog";
import { formatPrice, getMinPrice } from "@/lib/catalog";

interface ProductCardProps {
  photo: Photo;
}

export default function ProductCard({ photo }: ProductCardProps) {
  const minPrice = getMinPrice(photo);

  return (
    <Link
      href={`/product/${photo.slug}`}
      style={{ display: "block", background: "var(--paper-2)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--rule-2)", transition: "border-color 0.2s" }}
      className="group"
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: photo.aspectRatio === "2:3" ? "2/3" : "3/2", overflow: "hidden", background: "var(--rule-2)" }}>
        <Image
          src={photo.displayImageUrl}
          alt={photo.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQC/8QAHBAAAQQDAQAAAAAAAAAAAAAAAQACAxESIf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwsLhN5nNJGWJkiI7FPbq9Ke2o3BAQE7//2Q=="
        />
      </div>

      {/* Info */}
      <div style={{ padding: "0.875rem 1rem 1rem" }}>
        <h3 style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)", lineHeight: 1.35 }}>
          {photo.title}
        </h3>
        <p style={{ fontSize: "0.75rem", color: "var(--ink-2)", marginTop: "0.2rem" }}>
          {photo.location}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--faint)", marginTop: "0.6rem" }}>
          from {formatPrice(minPrice)}
        </p>
      </div>
    </Link>
  );
}
