import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const repo = new CategoryRepository();
    const service = new CategoryService(repo);

    const id = event.pathParameters?.Id;
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Category ID is required' }),
        };
    }

    const success = service.deleteCategory(id);
    if (!success) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Category not found' }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Category deleted successfully' }),
    };
}
