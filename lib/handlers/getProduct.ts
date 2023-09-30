import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { Product } from '../models/product';

interface AppSyncEvent {
    arguments: {
        [key: string]: any;
    };
}

export async function main(event: AppSyncEvent): Promise<Product> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const id = event.arguments?.Id;
    if (!id) {
        throw new Error('Product ID is required');
    }

    const product = await service.getProductById(id);  // Note the 'await' here

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
}

