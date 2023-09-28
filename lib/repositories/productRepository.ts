import { Product } from '../models/product';

// Import JSON data
const productsData: Product[] = require('../../data/products.json');
export class ProductRepository {
    // Mock in-memory storage
    private products: Product[] = productsData;

    getAll(): Product[] {
        return this.products;
    }

    getById(id: string): Product | null {
        return this.products.find(p => p.Id === id) || null;
    }

    // ... other CRUD operations
}
