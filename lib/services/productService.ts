import { Product } from '../models/product';
import { ProductRepository } from '../repositories/productRepository';

export class ProductService {
    constructor(private repo: ProductRepository) {}

    getAllProducts(): Product[] {
        return this.repo.getAll();
    }

    getProductById(id: string): Product | null {
        return this.repo.getById(id);
    }

    getProductsByCategoryId(categoryId: string): Product[] {
        return this.repo.getByCategoryId(categoryId);
    }

    addProduct(product: Product): Product {
        return this.repo.add(product);
    }

    updateProduct(id: string, updatedProductData: Product): Product | null {
        return this.repo.update(id, updatedProductData);
    }

    deleteProduct(id: string): boolean {
        return this.repo.delete(id);
    }


    // ... other operations
}
