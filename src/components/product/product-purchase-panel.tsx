"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/contexts/cart-context";
import { Product } from "@/domain/products/types";
import { formatCurrency } from "@/lib/currency";

type ProductPurchasePanelProps = {
  product: Product;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem, getItemQuantity } = useCart();
  const existingQuantity = getItemQuantity(product.id);
  const available = Math.max(product.inventory - existingQuantity, 0);
  const [quantity, setQuantity] = useState(() => (available > 0 ? 1 : 0));
  const [feedback, setFeedback] = useState<string | null>(null);

  const priceLabel = useMemo(
    () => formatCurrency(product.price, product.currency),
    [product.price, product.currency],
  );

  const exceedsInventory = available > 0 && quantity > available;
  const displayQuantity = available === 0 ? 0 : quantity;
  const canPurchase = available > 0 && !exceedsInventory && displayQuantity > 0;
  const statusMessage =
    available === 0
      ? "Out of stock"
      : exceedsInventory
        ? `Only ${available} unit${available === 1 ? "" : "s"} available`
        : feedback;

  const handleQuantityChange = (value: number) => {
    if (Number.isNaN(value)) {
      setQuantity(1);
      setFeedback(null);
      return;
    }

    if (value <= 0) {
      setQuantity(1);
      setFeedback(null);
      return;
    }

    setFeedback(null);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!canPurchase) {
      return;
    }

    const quantityToAdd = displayQuantity;
    const remainingAfterAdd = Math.max(
      product.inventory - (existingQuantity + quantityToAdd),
      0,
    );

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        currency: product.currency,
        thumbnailUrl: product.media[0]?.url,
      },
      quantityToAdd,
      product.inventory,
    );
    setFeedback(`${quantityToAdd} added to cart`);
    setQuantity(remainingAfterAdd > 0 ? Math.min(quantityToAdd, remainingAfterAdd) : 0);
  };

  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm text-zinc-500">Price</p>
        <p className="text-4xl font-semibold text-zinc-950">{priceLabel}</p>
        <p className="text-sm text-zinc-600">
          {available > 0
            ? `${available} unit${available === 1 ? "" : "s"} available`
            : "Out of stock"}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium text-zinc-700" htmlFor="quantity">
          Quantity
        </label>
        <input
          id="quantity"
          type="number"
          min={available > 0 ? 1 : 0}
          max={available}
          value={displayQuantity}
          onChange={(event) => handleQuantityChange(Number(event.target.value))}
          className="w-32 rounded-xl border border-orange-200 px-4 py-2 text-lg font-semibold text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:bg-orange-50"
          disabled={available === 0}
        />
        {statusMessage && (
          <p className="text-sm text-orange-600" role="status">
            {statusMessage}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!canPurchase}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-200"
      >
        Add to cart
      </button>
    </div>
  );
}
