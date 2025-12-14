import { loadMockProducts } from "./mockData";
import { Product } from "./types";

export type ProductRepository = {
  listAll(): Promise<Product[]>;
  listActive(): Promise<Product[]>;
};

class MockProductRepository implements ProductRepository {
  async listAll(): Promise<Product[]> {
    return loadMockProducts();
  }

  async listActive(): Promise<Product[]> {
    const products = await this.listAll();
    return products.filter((product) => product.isActive);
  }
}

export function createProductRepository(): ProductRepository {
  return new MockProductRepository();
}
