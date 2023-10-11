import { DynamoDB } from 'aws-sdk';
import { Product } from '../models/product';
import { generateUniqueId } from "./utils";

const dynamoDB = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME as string;
if (!TABLE_NAME) {
    throw new Error('Environment variable TABLE_NAME is not set');
}

export class ProductRepository {

    async getAll(): Promise<Product[]> {
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: "begins_with(pk, :productPrefix)",
            ExpressionAttributeValues: {
                ":productPrefix": "PRODUCT#"
            }
        };
        const results = await dynamoDB.scan(params).promise();
        return results.Items as Product[];
    }

    async getById(id: string): Promise<Product | null> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `PRODUCT#${id}`,
                SK: `PRODUCT#${id}`
            }
        };
        const result = await dynamoDB.get(params).promise();
        return result.Item as Product | null;
    }

    async getByCategoryId(categoryId: string): Promise<Product[]> {
        const params = {
            TableName: TABLE_NAME,
            IndexName: "GSI1",
            KeyConditionExpression: "GSI1PK = :categoryId",
            ExpressionAttributeValues: {
                ":categoryId": `CATEGORY#${categoryId}`
            }
        };
        const results = await dynamoDB.query(params).promise();
        return results.Items as Product[];
    }

    async add(product: Product): Promise<Product> {
        if (!product.Id) product.Id = generateUniqueId();

        const newProduct: Product = {
            ...product,
            PK: `PRODUCT#${product.Id}`,
            SK: `PRODUCT#${product.Id}`
        };

        const params = {
            TableName: TABLE_NAME,
            Item: newProduct
        };

        await dynamoDB.put(params).promise();

        return newProduct;
    }

    async update(id: string, updatedProductData: Partial<Product>): Promise<Product | null> {
        const updateExpressions: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        for (let key in updatedProductData) {
            if (key !== 'Id' && updatedProductData[key as keyof Product] !== undefined) {
                updateExpressions.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = updatedProductData[key as keyof Product];
            }
        }

        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `PRODUCT#${id}`,
                SK: `PRODUCT#${id}`
            },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
        };

        const result = await dynamoDB.update(params).promise();

        if (!result.Attributes) {
            throw new Error(`No product found with id ${id} to update`);
        }

        return result.Attributes as Product;
    }


    async delete(id: string): Promise<boolean> {
        const Params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `PRODUCT#${id}`,
                SK: `PRODUCT#${id}`
            }
        };

        const result = await dynamoDB.get(Params).promise();
        if (!result.Item) {
            throw new Error('Product not found');
        }

        await dynamoDB.delete(Params).promise();
        return true;
    }

}
