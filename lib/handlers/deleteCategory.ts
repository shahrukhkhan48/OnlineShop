import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';

interface AppSyncEvent {
    arguments: {
        Id: string;
    };
}

export async function main(event: AppSyncEvent): Promise<boolean> {
    const repo = new CategoryRepository();
    const service = new CategoryService(repo);

    const id = event.arguments.Id;
    if (!id) {
        throw new Error('Category ID is required');
    }

    const success = service.deleteCategory(id);
    if (!success) {
        throw new Error('Category not found');
    }

    return success;
}
