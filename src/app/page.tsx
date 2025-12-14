import { ProductGrid } from "@/components/catalog/product-grid";
import { createProductRepository } from "@/domain/products/repository";

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50 px-8 py-12 text-center text-zinc-700">
      <p className="text-lg font-semibold text-zinc-900">
        No products are live yet
      </p>
      <p className="mt-2 text-sm text-zinc-600">
        Activate a product in the admin console and it will show up for buyers
        immediately.
      </p>
    </div>
  );
}

export default async function HomePage() {
  const repository = createProductRepository();
  const products = await repository.listActive();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-12 sm:px-8">
        <section className="rounded-3xl bg-white px-8 py-12 shadow-sm shadow-orange-100">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
                Shopee Mini
              </p>
              <h1 className="mt-3 text-4xl font-bold text-zinc-950 sm:text-5xl">
                Curated finds for everyday delight
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-zinc-600">
                Browse the latest drops from our maker community. Every product is
                vetted for quality and ships within 2 business days.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-6 text-center text-sm text-zinc-700 sm:text-base">
              <div className="rounded-2xl border border-orange-100 px-6 py-4">
                <dt className="text-xs uppercase tracking-widest text-zinc-500">
                  Active SKUs
                </dt>
                <dd className="text-3xl font-semibold text-zinc-950">
                  {products.length.toString().padStart(2, "0")}
                </dd>
              </div>
              <div className="rounded-2xl border border-orange-100 px-6 py-4">
                <dt className="text-xs uppercase tracking-widest text-zinc-500">
                  Ships from
                </dt>
                <dd className="text-3xl font-semibold text-zinc-950">US</dd>
              </div>
            </dl>
          </div>
        </section>

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-zinc-950">
                Featured catalog
              </h2>
              <p className="text-sm text-zinc-600">
                Items marked out of stock can still be explored and favorited.
              </p>
            </header>
            <ProductGrid products={products} />
          </section>
        )}
      </main>
    </div>
  );
}
