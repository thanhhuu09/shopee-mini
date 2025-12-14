import { loadMockProducts } from "./mockData";
import { Product } from "./types";

export type ProductRepository = {
  listAll(): Promise<Product[]>;
  listActive(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | undefined>;
};

class MockProductRepository implements ProductRepository {
  async listAll(): Promise<Product[]> {
    return loadMockProducts();
  }

  async listActive(): Promise<Product[]> {
    const products = await this.listAll();
    return products
      .filter((product) => product.isActive)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  async findBySlug(slug: string): Promise<Product | undefined> {
    const products = await this.listAll();
    return products.find((product) => product.slug === slug);
  }
}

export function createProductRepository(): ProductRepository {
  return new MockProductRepository();
}
