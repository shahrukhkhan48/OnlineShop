import { ProductRepository } from '../repositories/product-repository';
import {Product, ProductCategory} from "../models/product";

export class ProductService {
    private repo: ProductRepository;

    constructor() {
        this.repo = new ProductRepository();
    }

    fetchAllCategories() {
        return this.repo.fetchAllCategories();
    }

    getCategoryById(id: number): ProductCategory | undefined {
        return this.repo.getCategoryById(id);
    }

    listProductsByCategory(categoryId: number): Product[] {
        return this.repo.getProductsByCategory(categoryId);
    }

    getProductById(productId: number): Product | undefined {
        return this.repo.getProductById(productId);
    }

    // Add more methods for other operations
}

