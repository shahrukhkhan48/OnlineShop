import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from '../models/category';

export class CategoryService {
    private repo: CategoryRepository;

    constructor(repo: CategoryRepository) {
        this.repo = repo;
    }

    getAllCategories(): Category[] {
        return this.repo.getAll();
    }

    getCategoryById(id: string): Category | null {
        return this.repo.getById(id);
    }

    // ... any other service methods you may need in the future
}
