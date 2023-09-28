import { Product } from '../models/product';
import { ProductRepository } from '../repositories/productRepository';

export class ProductService {
    constructor(private repo: ProductRepository) {}

    getAllProducts(): Product[] {
        return this.repo.getAllProducts();
    }

    getProductById(id: string): Product | null {
        return this.repo.getProductById(id);
    }

    getProductsByCategoryId(categoryId: string): Product[] {
        return this.repo.getProductByCategoryId(categoryId);
    }

    addProduct(product: Product): Product {
        return this.repo.addProduct(product);
    }

    updateProduct(id: string, updatedProductData: Product): Product | null {
        return this.repo.updateProduct(id, updatedProductData);
    }

    deleteProduct(id: string): boolean {
        return this.repo.deleteProduct(id);
    }


    // ... other operations
}
