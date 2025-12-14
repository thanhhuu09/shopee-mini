import Image from "next/image";
import Link from "next/link";

import { Product } from "@/domain/products/types";
import { formatCurrency } from "@/lib/currency";

export type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const primaryMedia = product.media[0];
  const formattedPrice = formatCurrency(product.price, product.currency);
  const isInStock = product.inventory > 0;

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-100 bg-white shadow-sm shadow-zinc-200/60 transition hover:-translate-y-0.5 hover:shadow-lg">
      {primaryMedia ? (
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-orange-100">
          <Image
            src={primaryMedia.url}
            alt={primaryMedia.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      ) : (
        <div className="h-48 w-full rounded-t-2xl bg-orange-50" />
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-950">{product.title}</h3>
          <p className="mt-1 text-sm text-zinc-600">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm font-medium text-zinc-900">
          <span>{formattedPrice}</span>
          <span className={isInStock ? "text-emerald-600" : "text-rose-500"}>
            {isInStock ? `${product.inventory} in stock` : "Out of stock"}
          </span>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
