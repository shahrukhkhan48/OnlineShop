import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import {Category} from "../models/category";

export async function main(event: APIGatewayProxyEventV2): Promise<Category[]> {

    const repo = new CategoryRepository();
    const service = new CategoryService(repo);

    const categories = service.getAllCategories();

    return categories;
}
