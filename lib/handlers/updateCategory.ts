import { CategoryService } from '../services/categoryService';
import { Category } from '../models/category';

interface UpdateCategoryArgs {
    Id: string;
    Name?: string;
    Description?: string;
}

interface AppSyncEvent {
    arguments: UpdateCategoryArgs;
}

export async function main(event: AppSyncEvent): Promise<Category> {
    const service = new CategoryService();
    const { Id, ...categoryData } = event.arguments;

    if (!Id) {
        throw new Error('Category ID is required');
    }

    const updatedCategory = await service.updateCategory(Id, categoryData);

    if (!updatedCategory) {
        throw new Error('Update failed or category not found');
    }

    return updatedCategory;
}
