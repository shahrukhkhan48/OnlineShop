import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const id = event.pathParameters?.Id;
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Product ID is required' }),
        };
    }

    const result = service.deleteProduct(id);

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
}
