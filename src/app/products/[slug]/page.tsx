import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { createProductRepository } from "@/domain/products/repository";
import { Product } from "@/domain/products/types";

type ProductDetailPageProps = {
  params: { slug: string };
};

function ProductGallery({ product }: { product: Product }) {
  if (product.media.length === 0) {
    return (
      <div className="aspect-square rounded-3xl border border-dashed border-orange-100" />
    );
  }

  return (
    <div className="space-y-4">
      {product.media.map((media, index) => (
        <div
          key={`${media.url}-${index}`}
          className="relative aspect-square overflow-hidden rounded-3xl bg-orange-50"
        >
          <Image
            src={media.url}
            alt={media.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = params;
  const repository = createProductRepository();
  const product = await repository.findBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="bg-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          Back to catalog
        </Link>
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery product={product} />
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                Featured
              </p>
              <h1 className="text-4xl font-bold text-zinc-950">{product.title}</h1>
              <p className="text-base text-zinc-600">{product.description}</p>
              <p className="text-sm text-zinc-500">
                Updated {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <ProductPurchasePanel product={product} />
          </div>
        </div>
      </main>
    </div>
  );
}
