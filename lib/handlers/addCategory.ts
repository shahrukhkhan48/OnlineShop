import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from "../models/category";

interface CategoryInputArgs {
    category: Category;
}

interface AppSyncEvent {
    arguments: CategoryInputArgs;
}

export async function main(event: AppSyncEvent): Promise<Category> {
    const service = new CategoryService();

    const { category } = event.arguments;

    // Ensure that the service's method is awaited to handle the promise
    const addedCategory = await service.addCategory(category);

    return addedCategory;
}
