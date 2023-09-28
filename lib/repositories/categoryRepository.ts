import { Category } from '../models/category';
import { generateUniqueId } from './utils';

// Import JSON data
const categoriesData: Category[] = require('../../data/categories.json');

export class CategoryRepository {
    // Use the imported data instead of an empty array
    private categories: Category[] = categoriesData;

    // Sample method to generate a unique ID


    getAll(): Category[] {
        return this.categories;
    }

    getById(id: string): Category | null {
        return this.categories.find(c => c.Id === id) || null;
    }

    add(category: Category): Category {
        // Ensure the category has a unique Id
        if (!category.Id) {
            category.Id = generateUniqueId(); // Replace with your ID generation method
        }

        // Validate the category data
        if (!category.Name) {
            throw new Error('Category name is required');
        }

        this.categories.push(category);
        return category;
    }


    update(id: string, updatedCategoryData: Category): Category | null {
        const index = this.categories.findIndex(category => category.Id === id);
        if (index === -1) return null;

        // Overwrite the existing category data with the updated data
        this.categories[index] = {...this.categories[index], ...updatedCategoryData};
        return this.categories[index];
    }

    delete(id: string): boolean {
        const initialLength = this.categories.length;
        this.categories = this.categories.filter(category => category.Id !== id);
        return this.categories.length < initialLength;
    }

    // ... other CRUD operations if needed
}
