import { CategoryService } from '../services/categoryService';
import { Category } from '../models/category';

interface AppSyncEvent {
    arguments: {
        Id: string;
    };
}

export async function main(event: AppSyncEvent): Promise<Category> {
    const { Id } = event.arguments;

    if (!Id) {
        throw new Error('Category ID is required');
    }

    try {
        const service = new CategoryService();
        const category = await service.getCategoryById(Id);

        if (!category) {
            throw new Error('Category not found');
        }

        return category;
    } catch (error) {
        console.error('Error occurred:', error);
        throw new Error('Internal Server Error');
    }
}
