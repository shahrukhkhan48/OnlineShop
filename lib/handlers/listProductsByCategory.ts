import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const categoryId = event.pathParameters?.categoryId;
    if (!categoryId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Category ID is required' }),
        };
    }

    const products = service.getProductsByCategoryId(categoryId);

    return {
        statusCode: 200,
        body: JSON.stringify(products),
    };
}
