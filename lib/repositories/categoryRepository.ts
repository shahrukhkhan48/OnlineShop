import { DynamoDB } from 'aws-sdk';
import { Category } from '../models/category';
import { generateUniqueId } from "./utils";

const dynamoDB = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME as string;
if (!TABLE_NAME) {
    throw new Error('Environment variable TABLE_NAME is not set');
}

export class CategoryRepository {

    async getAll(): Promise<Category[]> {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: "begins_with(PK, :categoryPrefix)",
            ExpressionAttributeValues: {
                ":categoryPrefix": "CATEGORIES"
            }
        };

        try {
            const results = await dynamoDB.scan(params).promise();
            return (results.Items as Category[]) || [];
        } catch (error) {
            console.error('Error occurred in repository layer:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<Category | null> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: 'CATEGORIES',
                SK: `CATEGORY#${id}`
            }
        };

        try {
            const result = await dynamoDB.get(params).promise();
            return result.Item as Category | null;
        } catch (error) {
            console.error('Error occurred in repository layer:', error);
            throw error;
        }
    }

    async add(category: Category): Promise<Category> {
        if (!category.Id) category.Id = generateUniqueId();

        const newCategory: Category = {
            ...category,
            PK: "CATEGORIES",
            SK: `CATEGORY#${category.Id}`
        };

        const params = {
            TableName: TABLE_NAME,
            Item: newCategory
        };

        await dynamoDB.put(params).promise();

        return newCategory;
    }

    async update(id: string, updatedCategoryData: Partial<Category>): Promise<Category | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        for (let key in updatedCategoryData) {
            if (key !== 'Id' && updatedCategoryData[key as keyof Category] !== undefined) {
                updateExpressions.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = updatedCategoryData[key as keyof Category];
            }
        }

        if (updateExpressions.length === 0) {
            throw new Error('No valid fields provided for update');
        }

        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: "CATEGORIES",
                SK: `CATEGORY#${id}`
            },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
        };

        const result = await dynamoDB.update(params).promise();

        if (result.Attributes) {
            return result.Attributes as Category;
        } else {
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        // First, check if the item exists
        const Params = {
            TableName: TABLE_NAME,
            Key: {
                PK: "CATEGORIES",
                SK: `CATEGORY#${id}`
            }
        };

        const result = await dynamoDB.get(Params).promise();
        if (!result.Item) {
            throw new Error('Category not found');
        }

        await dynamoDB.delete(Params).promise();
        return true;
    }
}
