import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { ProductSchema } from '../models/product';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const id = event.pathParameters?.id;
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Product ID is required' }),
        };
    }

    const wasDeleted = service.deleteProduct(id);

    if (!wasDeleted) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Product not found' }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Product deleted successfully' }),
    };
}
