import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from "../models/category";

interface AppSyncEvent {
    arguments: {
        [key: string]: any;
    };
}

export async function main(event: AppSyncEvent): Promise<Category> {
    const repo = new CategoryRepository();
    const service = new CategoryService(repo);

    const categoryData: Category =  event.arguments.category;
    const addedCategory = service.addCategory(categoryData);

    return addedCategory;
}
