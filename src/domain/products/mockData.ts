import { Product } from "./types";

const now = new Date().toISOString();

export const mockProducts: Product[] = [
  {
    id: "sku-sun-protect",
    slug: "summer-sun-protect",
    title: "Summer Sun Protect SPF 50",
    description:
      "Lightweight sunscreen that shields skin from UV rays without clogging pores.",
    price: 1299,
    currency: "USD",
    inventory: 32,
    media: [
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
        alt: "Sunscreen tube on sand",
      },
    ],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sku-cozy-mug",
    slug: "cozy-ceramic-mug",
    title: "Cozy Ceramic Mug",
    description:
      "Handmade matte ceramic mug that keeps drinks warm during long work sessions.",
    price: 1899,
    currency: "USD",
    inventory: 18,
    media: [
      {
        url: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
        alt: "Ceramic mug on table",
      },
    ],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sku-wireless-buds",
    slug: "wireless-fit-earbuds",
    title: "Wireless Fit Earbuds",
    description:
      "Noise-isolating earbuds with 24-hour battery life and IPX4 sweat resistance.",
    price: 4999,
    currency: "USD",
    inventory: 12,
    media: [
      {
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
        alt: "Wireless earbuds on desk",
      },
    ],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sku-notebook",
    slug: "linen-notebook",
    title: "Linen Notebook",
    description:
      "A5 dotted notebook with sustainable paper perfect for journaling and planning.",
    price: 1599,
    currency: "USD",
    inventory: 0,
    media: [
      {
        url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
        alt: "Notebook with linen cover",
      },
    ],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sku-lantern",
    slug: "warm-ambience-lantern",
    title: "Warm Ambience Lantern",
    description:
      "Rechargeable lantern with adjustable glow to set the mood indoors or outdoors.",
    price: 3499,
    currency: "USD",
    inventory: 5,
    media: [
      {
        url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
        alt: "Lantern emitting warm light",
      },
    ],
    isActive: false,
    createdAt: now,
    updatedAt: now,
  },
];

export async function loadMockProducts(): Promise<Product[]> {
  // Simulate async loading so App Router can surface loading states during navigation.
  await new Promise((resolve) => setTimeout(resolve, 120));
  return mockProducts;
}
