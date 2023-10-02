import { DynamoDB } from 'aws-sdk';
import { Category } from '../models/category';
import { generateUniqueId } from "./utils";

const dynamoDB = new DynamoDB.DocumentClient();

// Asserting that TABLE_NAME is a string. If it's undefined, throw an error.
const TABLE_NAME = process.env.TABLE_NAME as string;
if (!TABLE_NAME) {
    throw new Error('Environment variable TABLE_NAME is not set');
}

export class CategoryRepository {

    async getAll(): Promise<Category[]> {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: "PK = :categoryPrefix",
            ExpressionAttributeValues: {
                ":categoryPrefix": "CATEGORIES"
            }
        };
        const results = await dynamoDB.scan(params).promise();
        return results.Items as Category[];
    }

    async getById(id: string): Promise<Category | null> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: "CATEGORIES",
                SK: `CATEGORY#${id}`
            }
        };
        const result = await dynamoDB.get(params).promise();
        return result.Item as Category | null;
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

    async update(id: string, updatedCategoryData: Category): Promise<Category | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        // Loop over category data and build update expressions
        for (let key in updatedCategoryData) {
            if (key !== 'Id' && key !== 'PK' && key !== 'SK' && updatedCategoryData[key as keyof Category] !== undefined) {
                updateExpressions.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = updatedCategoryData[key as keyof Category];
            }
        }

        // Check if there's anything to update
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
            const updatedCategory = await this.getById(id);  // Use the getById method to fetch the full category
            return updatedCategory;
        } else {
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: "CATEGORIES",
                SK: `CATEGORY#${id}`
            }
        };
        await dynamoDB.delete(params).promise();
        return true;  // Assuming delete is successful
    }
}
