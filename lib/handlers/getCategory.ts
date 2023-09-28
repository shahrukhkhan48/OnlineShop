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

    const id = event.arguments?.Id;
    if (!id) {
        throw new Error('Category ID is required');
    }

    const category = service.getCategoryById(id);

    if (!category) {
        throw new Error('Category not found');
    }

    return category;
}
