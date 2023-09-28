import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const repo = new CategoryRepository();
    const service = new CategoryService(repo);

    const categories = service.getAllCategories();

    return {
        statusCode: 200,
        body: JSON.stringify(categories),
    };
}
