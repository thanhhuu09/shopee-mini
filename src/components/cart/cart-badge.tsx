"use client";

import Link from "next/link";

import { useCart } from "@/contexts/cart-context";

export function CartBadge() {
  const { totalQuantity } = useCart();

  return (
    <Link
      href="#cart"
      className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
      aria-label={`Open cart with ${totalQuantity} item${totalQuantity === 1 ? "" : "s"}`}
    >
      Cart
      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
        {totalQuantity}
      </span>
    </Link>
  );
}
