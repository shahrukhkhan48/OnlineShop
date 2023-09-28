import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { ProductSchema } from '../models/product';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const productData = JSON.parse(event.body || '{}');

    // Input validation using zod
    const parsedData = ProductSchema.safeParse(productData);
    if (!parsedData.success) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid product data' }),
        };
    }

    const newProduct = service.addProduct(parsedData.data);

    return {
        statusCode: 201,
        body: JSON.stringify(newProduct),
    };
}
