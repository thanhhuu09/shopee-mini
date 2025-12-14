import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateSubtotal,
  clampQuantity,
  sanitizeCartItems,
  type CartItem,
} from "../../cart/types";

test("clampQuantity enforces inventory bounds", () => {
  assert.equal(clampQuantity(5, 3), 3);
  assert.equal(clampQuantity(0, 10), 1);
  assert.equal(clampQuantity(2, 2), 2);
});

test("sanitizeCartItems filters and normalizes data", () => {
  const raw = [
    {
      productId: "one",
      slug: "one",
      title: "Item One",
      price: 1000,
      currency: "USD",
      quantity: 5,
      inventory: 2,
    },
    {
      productId: 42,
      slug: 42,
      title: 42,
      price: "not-a-number",
      quantity: "3",
      inventory: "10",
    },
  ];

  const sanitized = sanitizeCartItems(raw);
  assert.equal(sanitized.length, 1);
  assert.equal(sanitized[0]?.quantity, 2);
  assert.equal(sanitized[0]?.inventory, 2);
});

test("calculateSubtotal multiplies prices and quantities", () => {
  const items: CartItem[] = [
    {
      productId: "a",
      slug: "a",
      title: "Item A",
      price: 1000,
      currency: "USD",
      quantity: 2,
      inventory: 5,
    },
    {
      productId: "b",
      slug: "b",
      title: "Item B",
      price: 500,
      currency: "USD",
      quantity: 4,
      inventory: 4,
    },
  ];
  assert.equal(calculateSubtotal(items), 1000 * 2 + 500 * 4);
});
