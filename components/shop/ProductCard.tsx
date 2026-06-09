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
      className="group block bg-[#141414] rounded overflow-hidden border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-[#1a1a1a]">
        <Image
          src={photo.displayImageUrl}
          alt={photo.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwQC/8QAHBAAAQQDAQAAAAAAAAAAAAAAAQACAxESIf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwsLhN5nNJGWJkiI7FPbq9Ke2o3BAQE7//2Q=="
        />
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <h3 className="text-sm text-[#f5f5f5] leading-snug">{photo.title}</h3>
        <p className="text-xs text-[#888888] mt-0.5">{photo.location}</p>
        <p className="text-xs text-[#d4a853] mt-2">
          from {formatPrice(minPrice)}
        </p>
      </div>
    </Link>
  );
}
