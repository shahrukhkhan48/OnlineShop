import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from '../models/category';

interface AppSyncEvent {
    arguments: {
        [key: string]: any;
    };
}

export async function main(event: AppSyncEvent) {
    const repo = new CategoryRepository();
    const service = new CategoryService(repo);

    try {
        const id = event.arguments?.Id;
        const categoryData = event.arguments;

        const updatedCategory = await service.updateCategory(id, categoryData as Category);

        return updatedCategory;

    } catch (error) {
        console.error('Error occurred:', error);  // Log the error for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
}
