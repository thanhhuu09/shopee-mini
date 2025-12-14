import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createProductRepository } from "@/domain/products/repository";
import { formatCurrency } from "@/lib/currency";

type ProductDetailPageProps = {
  params: { slug: string };
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = params;
  const repository = createProductRepository();
  const product = await repository.findBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const heroMedia = product.media[0];
  const price = formatCurrency(product.price, product.currency);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          ← Back to catalog
        </Link>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            {heroMedia ? (
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-orange-50">
                <Image
                  src={heroMedia.url}
                  alt={heroMedia.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="aspect-square rounded-3xl border border-dashed border-orange-100" />
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                Limited release
              </p>
              <h1 className="mt-2 text-4xl font-bold text-zinc-950">
                {product.title}
              </h1>
              <p className="mt-4 text-base text-zinc-600">{product.description}</p>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-orange-50 px-6 py-4">
              <p className="text-sm text-zinc-600">Price</p>
              <p className="text-3xl font-semibold text-zinc-950">{price}</p>
              <p className="mt-2 text-sm text-zinc-600">
                Inventory: {product.inventory > 0 ? `${product.inventory} units` : "Out of stock"}
              </p>
            </div>
            <p className="text-sm text-zinc-500">
              Full product detail experience ships in a later task. For now, this
              page acts as a placeholder so catalog CTAs remain functional per Task
              001 requirements.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
