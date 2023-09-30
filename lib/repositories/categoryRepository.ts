import { Category } from '../models/category';
import { Table } from 'dynamodb-onetable';
import * as AWS from 'aws-sdk';
import { generateUniqueId } from "./utils";

const client = new AWS.DynamoDB.DocumentClient();
const CategoriesTable = new Table({
    client,
    name: process.env.TABLE_NAME!,
    schema: {
        version: '0.1',
        indexes: {
            primary: { hash: 'pk', sort: 'sk' },
            GSI1: { hash: 'GSI1PK', sort: 'GSI1SK' }
        },
        models: {
            Category: {
                pk: { type: 'string', value: 'CATEGORIES' },
                sk: { type: 'string', value: 'CATEGORY#${id}' },
                id: { type: 'string' },
                Name: { type: 'string' },
                Description: { type: 'string', required: false }
            }
        },
    },
});

export class CategoryRepository {

    async getAll(): Promise<Category[]> {
        const results = await CategoriesTable.scan('Category');
        return results as Category[];
    }

    async getById(id: string): Promise<Category | null> {
        const category = await CategoriesTable.get('Category', { id });
        return category as Category || null;
    }

    async add(category: Category): Promise<Category> {
        if (!category.Id) category.Id = generateUniqueId();
        if (!category.Name) throw new Error('Category name is required');

        await CategoriesTable.create('Category', category);
        return category;
    }

    async update(id: string, updatedCategoryData: Category): Promise<Category | null> {
        const updatedCategory = await CategoriesTable.update('Category', {
            id,
            ...updatedCategoryData,
        }) as Category;

        if (!updatedCategory) {
            return null;
        }

        return updatedCategory;
    }

    async delete(id: string): Promise<boolean> {
        await CategoriesTable.remove('Category', { id });
        return true;
    }
}
