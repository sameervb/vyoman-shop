import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPhotoBySlug, catalog } from "@/lib/catalog";
import ProductDetail from "@/components/shop/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return catalog.map((photo) => ({ slug: photo.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);
  if (!photo) return {};
  return {
    title: `${photo.title} · Vyoman Shop`,
    description: photo.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);
  if (!photo) notFound();

  return <ProductDetail photo={photo} />;
}
