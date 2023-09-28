import { Product } from '../models/product';

// Import JSON data
const productsData: Product[] = require('../../data/products.json');
export class ProductRepository {
    // Mock in-memory storage
    private products: Product[] = productsData;

    getAllProducts(): Product[] {
        return this.products;
    }

    getProductById(id: string): Product | null {
        return this.products.find(p => p.Id === id) || null;
    }

    getProductByCategoryId(categoryId: string): Product[] {
        return this.products.filter(p => p.Category === categoryId);
    }

    addProduct(product: Product): Product {
        this.products.push(product);
        return product;
    }

    updateProduct(id: string, updatedProductData: Product): Product | null {
        const index = this.products.findIndex(p => p.Id === id);

        if (index === -1) return null;  // Product not found

        // Update the product at the specific index
        this.products[index] = { ...this.products[index], ...updatedProductData };

        return this.products[index];
    }

    deleteProduct(id: string): boolean {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.Id !== id);
        return this.products.length < initialLength;  // Returns true if a product was removed
    }



    // ... other CRUD operations
}
