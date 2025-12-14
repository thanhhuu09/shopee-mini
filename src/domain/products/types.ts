export type ProductMedia = {
  url: string;
  alt: string;
};

/**
 * Product shape as defined in PRD. Price is stored in the smallest currency unit (e.g. cents).
 */
export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  inventory: number;
  media: ProductMedia[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
