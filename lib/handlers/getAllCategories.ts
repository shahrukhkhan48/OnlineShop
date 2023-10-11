import { CategoryService } from '../services/categoryService';
import { Category } from "../models/category";

export async function main(): Promise<Category[]> {
    try {
        const service = new CategoryService();
        return await service.getAllCategories();
    } catch (error) {
        console.error('Error occurred:', error);
        throw new Error('Internal Server Error');
    }
}
