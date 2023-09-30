import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from '../models/category';

export class CategoryService {
    private repo: CategoryRepository;

    constructor(repo: CategoryRepository) {
        this.repo = repo;
    }

    async getAllCategories(): Promise<Category[]> {
        return await this.repo.getAll();
    }

    async getCategoryById(id: string): Promise<Category | null> {
        return await this.repo.getById(id);
    }

    async addCategory(category: Category): Promise<Category> {
        return await this.repo.add(category);
    }

    async updateCategory(id: string, updatedCategoryData: Category): Promise<Category | null> {
        return await this.repo.update(id, updatedCategoryData);
    }

    async deleteCategory(id: string): Promise<boolean> {
        return await this.repo.delete(id);
    }

}
