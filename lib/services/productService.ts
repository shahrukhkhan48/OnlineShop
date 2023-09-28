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

    // ... other operations
}
