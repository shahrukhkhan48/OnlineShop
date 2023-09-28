import { Category } from '../models/category';

// Import JSON data
const categoriesData: Category[] = require('../../data/categories.json');

export class CategoryRepository {
    // Use the imported data instead of an empty array
    private categories: Category[] = categoriesData;

    getAll(): Category[] {
        return this.categories;
    }

    getById(id: string): Category | null {
        return this.categories.find(c => c.Id === id) || null;
    }

    // ... other CRUD operations if needed
}
