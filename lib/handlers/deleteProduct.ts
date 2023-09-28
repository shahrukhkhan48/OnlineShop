import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

interface AppSyncEvent {
    arguments: {
        [key: string]: any;
    };
}

export async function main(event: AppSyncEvent): Promise<Boolean> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const id = event.arguments.Id;
    if (!id) {
        throw new Error('Product ID is required');
    }

    const success = service.deleteProduct(id);

    if (!success) {
        throw new Error('Failed to delete product or product not found');
    }

    return success;
}

