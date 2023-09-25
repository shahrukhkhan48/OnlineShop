import { ProductRepository } from '../repositories/product-repository';
import {ProductCategory} from "../models/product";

export class ProductService {
    private repo: ProductRepository;

    constructor() {
        this.repo = new ProductRepository();
    }

    fetchAllCategories() {
        return this.repo.fetchAllCategories();
    }

    getCategoryById(id: number): ProductCategory | null {
        return this.repo.getCategoryById(id);
    }
    // Add more methods for other operations
}
