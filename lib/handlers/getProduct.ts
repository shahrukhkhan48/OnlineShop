import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Product } from '../models/product';

export async function main(event: APIGatewayProxyEventV2): Promise<Product> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const id = event.pathParameters?.Id;
    if (!id) {
        throw new Error('Product ID is required');
    }

    const product = service.getProductById(id);

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
}
