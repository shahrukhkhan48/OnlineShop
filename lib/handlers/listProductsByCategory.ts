import { ProductService } from '../services/productService';
import { Product } from '../models/product';

interface AppSyncEvent {
    arguments: {
        Category: string;
    };
}

export async function main(event: AppSyncEvent): Promise<Product[]> {
    const service = new ProductService();

    const { Category } = event.arguments;
    if (!Category) {
        throw new Error('Category ID is required');
    }

    const products = await service.getProductsByCategoryId(Category);
    return products;
}
