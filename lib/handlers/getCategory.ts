import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Category } from "../models/category";

export async function main(event: APIGatewayProxyEventV2): Promise<Category> {
    const repo = new CategoryRepository();
    const service = new CategoryService(repo);

    const id = event.pathParameters?.Id;
    if (!id) {
        throw new Error('Category ID is required');
    }

    const category = service.getCategoryById(id);

    if (!category) {
        throw new Error('Category not found');
    }

    return category;
}
