import { Product } from '../models/product';
import { generateUniqueId } from './utils';


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

    getByCategoryId(categoryId: string): Product[] {
        return this.products.filter(p => p.Category === categoryId);
    }

    add(product: Product): Product {
        // Ensure all required fields are set
        if (!product.Id) {
            product.Id = generateUniqueId(); // Assuming you have a method to generate unique IDs
        }
        if (!product.Name || !product.Price || !product.Currency || !product.Weight || !product.Category) {
            throw new Error('Incomplete product data');
        }

        this.products.push(product);
        return product;
    }

    update(id: string, updatedProductData: Product): Product | null {
        const index = this.products.findIndex(p => p.Id === id);

        if (index === -1) return null;  // Product not found

        // Update the product at the specific index
        this.products[index] = { ...this.products[index], ...updatedProductData };

        return this.products[index];
    }

    delete(id: string): boolean {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.Id !== id);
        return this.products.length < initialLength;  // Returns true if a product was removed
    }



    // ... other CRUD operations
}
