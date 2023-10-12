import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from '../models/category';

export class CategoryService {
    private repo: CategoryRepository;

    constructor() {
        this.repo = new CategoryRepository();
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            return await this.repo.getAll();
        } catch (error) {
            console.error('Error occurred in service layer:', error);
            throw error;
        }
    }

    async getCategoryById(id: string): Promise<Category | null> {
        try {
            return await this.repo.getById(id);
        } catch (error) {
            console.error('Error occurred in service layer:', error);
            throw error;
        }
    }

    async addCategory(category: Category): Promise<Category> {
        return await this.repo.add(category);
    }

    async updateCategory(id: string, updatedCategoryData: Partial<Category>): Promise<Category> {
        const updatedCategory = await this.repo.update(id, updatedCategoryData);

        if (!updatedCategory) {
            throw new Error(`Failed to update category with ID ${id}`);
        }

        return updatedCategory;
    }

    async deleteCategory(id: string): Promise<boolean> {
        return await this.repo.delete(id);
    }

}
