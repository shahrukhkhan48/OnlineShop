import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';

interface AppSyncEvent {
    arguments: {
        Id: string;
    };
}

export async function main(event: AppSyncEvent): Promise<boolean> {
    const service = new ProductService();

    const id = event.arguments.Id;
    if (!id) {
        throw new Error('Product ID is required');
    }

    const success = await service.deleteProduct(id);
    if (!success) {
        throw new Error('Failed to delete product or product not found');
    }

    return success;
}
