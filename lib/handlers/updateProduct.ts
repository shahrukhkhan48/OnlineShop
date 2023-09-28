import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { ProductSchema } from '../models/product';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const id = event.pathParameters?.Id;
    const productData = JSON.parse(event.body || '{}');

    // Input validation (using zod or any other library)
    const parsedData = ProductSchema.safeParse(productData);
    if (!parsedData.success) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid product data' }),
        };
    }

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Product ID is required' }),
        };
    }

    const updatedProduct = service.updateProduct(id, parsedData.data);

    if (!updatedProduct) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Product not found' }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedProduct),
    };
}
