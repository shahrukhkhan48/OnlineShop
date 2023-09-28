import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Product } from '../models/product';

export async function main(event: APIGatewayProxyEventV2): Promise<Product[]> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const CategoryId = event.pathParameters?.CategoryId;
    if (!CategoryId) {
        throw new Error('Category ID is required');
    }

    const products = service.getProductsByCategoryId(CategoryId);
    return products;
}
