import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from '../models/category';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const repo = new CategoryRepository();
    const service = new CategoryService(repo);

    const categoryData: Category = JSON.parse(event.body || '{}');
    const addedCategory = service.addCategory(categoryData);

    return {
        statusCode: 201,
        body: JSON.stringify(addedCategory),
    };
}
