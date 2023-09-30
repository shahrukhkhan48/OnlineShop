import { Product } from '../models/product';
import { ProductRepository } from '../repositories/productRepository';

export class ProductService {
    constructor(private repo: ProductRepository) {}

    async getAllProducts(): Promise<Product[]> {
        return await this.repo.getAll();
    }

    async getProductById(id: string): Promise<Product | null> {
        return await this.repo.getById(id);
    }

    async getProductsByCategoryId(categoryId: string): Promise<Product[]> {
        return await this.repo.getByCategoryId(categoryId);
    }

    async addProduct(product: Product): Promise<Product> {
        return await this.repo.add(product);
    }

    async updateProduct(id: string, updatedProductData: Product): Promise<Product | null> {
        return await this.repo.update(id, updatedProductData);
    }

    async deleteProduct(id: string): Promise<boolean> {
        return await this.repo.delete(id);
    }
}
