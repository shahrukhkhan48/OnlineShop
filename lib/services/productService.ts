import { Product } from '../models/product';
import { ProductRepository } from '../repositories/productRepository';

export class ProductService {
    private repo = new ProductRepository();

    async getAllProducts(): Promise<Product[]> {
        return await this.repo.getAll();
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.repo.getById(id);

        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }

        return product;
    }

    async getProductsByCategoryId(categoryId: string): Promise<Product[]> {
        return await this.repo.getByCategoryId(categoryId);
    }

    async addProduct(product: Product): Promise<Product> {
        return await this.repo.add(product);
    }

    async updateProduct(id: string, updatedProductData: Partial<Product>): Promise<Product> {
        const updatedProduct = await this.repo.update(id, updatedProductData);
        if (!updatedProduct) {
            throw new Error(`Product with id ${id} not found`);
        }
        return updatedProduct;
    }



    async deleteProduct(id: string): Promise<boolean> {
        return await this.repo.delete(id);
    }
}
