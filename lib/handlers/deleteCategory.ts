import { CategoryService } from '../services/categoryService';
import { CategoryRepository } from '../repositories/categoryRepository';

interface DeleteCategoryArgs {
    Id: string;
}

interface AppSyncEvent {
    arguments: DeleteCategoryArgs;
}

export async function main(event: AppSyncEvent): Promise<boolean> {
    const service = new CategoryService();
    const { Id: id } = event.arguments;

    if (!id) {
        throw new Error('Category ID is required');
    }

    const success = await service.deleteCategory(id);

    if (!success) {
        throw new Error('Category not found or deletion failed');
    }

    return success;
}
