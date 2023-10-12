import { ProductService } from '../services/productService';
import { Product } from '../models/product';

interface AppSyncEvent {
    arguments: {
        Id: string;
    };
}

export async function main(event: AppSyncEvent): Promise<Product> {
    const service = new ProductService();
    const { Id: id } = event.arguments;

    if (!id) {
        throw new Error('Product ID is required');
    }

    const product = await service.getProductById(id);

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
}
