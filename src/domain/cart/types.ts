export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  quantity: number;
  inventory: number;
};

function toInteger(value: unknown, fallback: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function clampQuantity(quantity: number, inventory: number) {
  if (inventory <= 0) {
    return 0;
  }
  const desiredValue = Math.floor(quantity);
  const desired = Number.isFinite(desiredValue) ? desiredValue : 1;
  if (desired <= 0) {
    return 1;
  }
  return Math.min(desired, inventory);
}

export function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      const productId = typeof item?.productId === "string" ? item.productId : "";
      const slug = typeof item?.slug === "string" ? item.slug : productId;
      const title = typeof item?.title === "string" ? item.title : slug;
      const price = toInteger(item?.price, 0);
      const currency = typeof item?.currency === "string" ? item.currency : "USD";
      const thumbnailUrl = typeof item?.thumbnailUrl === "string" ? item.thumbnailUrl : undefined;
      const rawInventory = toInteger(item?.inventory, 1);
      const inventory = Math.max(0, rawInventory);
      const quantity = clampQuantity(toInteger(item?.quantity, 1), inventory);

      return {
        productId,
        slug,
        title,
        price,
        currency,
        thumbnailUrl,
        quantity,
        inventory,
      } satisfies CartItem;
    })
    .filter((item) => Boolean(item.productId) && item.price >= 0 && item.inventory > 0);
}

export function calculateSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
