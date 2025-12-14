"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/currency";

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50 px-8 py-16 text-center">
      <p className="text-lg font-semibold text-zinc-900">Your cart is empty</p>
      <p className="mt-2 text-sm text-zinc-600">Browse the catalog and add items to continue.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-600"
      >
        Continue shopping
      </Link>
    </div>
  );
}

export function CartView() {
  const { items, subtotal, ready, updateQuantity, removeItem } = useCart();
  const currency = items[0]?.currency ?? "USD";
  const subtotalLabel = useMemo(() => formatCurrency(subtotal, currency), [subtotal, currency]);
  const checkoutDisabled = !ready || items.length === 0;

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-3xl bg-orange-50" />
        <div className="h-48 animate-pulse rounded-3xl bg-orange-50" />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        {items.map((item) => (
          <article
            key={item.productId}
            className="flex flex-col gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:flex-row"
          >
            <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-orange-50 sm:h-32 sm:w-32">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Link href={`/products/${item.slug}`} className="text-lg font-semibold text-zinc-950">
                  {item.title}
                </Link>
                <span className="text-sm text-zinc-600">
                  {formatCurrency(item.price, item.currency)} each
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-sm font-medium text-zinc-700">
                  Quantity
                  <input
                    type="number"
                    min={1}
                    max={item.inventory}
                    step={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    className="ml-3 w-24 rounded-xl border border-orange-200 px-3 py-1.5 text-base font-semibold text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-sm font-semibold text-rose-500 hover:text-rose-600"
                >
                  Remove
                </button>
              </div>
              <p className="text-sm text-zinc-500">
                {item.inventory} unit{item.inventory === 1 ? "" : "s"} available
              </p>
            </div>
            <p className="text-lg font-semibold text-zinc-950">
              {formatCurrency(item.price * item.quantity, item.currency)}
            </p>
          </article>
        ))}
      </section>

      <aside className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-950">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm text-zinc-600">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd className="text-base font-semibold text-zinc-950">{subtotalLabel}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Shipping</dt>
            <dd>Calculated at checkout</dd>
          </div>
        </dl>
        {checkoutDisabled && (
          <p className="mt-4 text-sm text-rose-500">
            Add at least one item before proceeding to checkout.
          </p>
        )}
        <button
          type="button"
          disabled={checkoutDisabled}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-200"
        >
          Proceed to checkout
        </button>
      </aside>
    </div>
  );
}
