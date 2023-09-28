import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from '../models/category';
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

    const updatedData: Category = JSON.parse(event.body || '{}');
    const updatedCategory = service.updateCategory(id, updatedData);
    if (!updatedCategory) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Category not found' }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedCategory),
    };
}
