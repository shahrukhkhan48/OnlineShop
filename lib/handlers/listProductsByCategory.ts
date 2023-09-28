import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Product } from '../models/product';

interface AppSyncEvent {
    arguments: {
        [key: string]: any;
    };
}

export async function main(event: AppSyncEvent): Promise<Product[]> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const Category = event.arguments.Category;
    if (!Category) {
        throw new Error('Category ID is required');
    }

    const products = service.getProductsByCategoryId(Category);
    return products;
}
