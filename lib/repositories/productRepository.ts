import { Product } from '../models/product';
import * as AWS from 'aws-sdk';
import { Table } from 'dynamodb-onetable';
import {generateUniqueId} from "./utils";

const client = new AWS.DynamoDB.DocumentClient();

const ProductsTable = new Table({
    client,
    name: process.env.TABLE_NAME,
    schema: {
        version: '0',
        indexes: {
            primary: { hash: 'pk', sort: 'sk' },
            GSI1: { hash: 'GSI1PK', sort: 'GSI1SK' }
        },
        models: {
            Product: {
                pk: { type: 'string', value: 'PRODUCT#${id}' },
                sk: { type: 'string', value: 'PRODUCT#${id}' },
                Name: { type: 'string' },
                Description: { type: 'string' },
                Price: { type: 'number' },
                Currency: { type: 'string' },
                Weight: { type: 'number' },
                ImageUrl: { type: 'string' },
                Supplier: { type: 'string' },
                Category: { type: 'string' },
                GSI1PK: { type: 'string', value: 'CATEGORY#${Category}' },
                GSI1SK: { type: 'string', value: 'PRODUCT#${id}' }
            }
        }
    }
});

export class ProductRepository {

    async getAll(): Promise<Product[]> {
        const results: any = await ProductsTable.scan('Product');
        return results as Product[];
    }

    async getById(id: string): Promise<Product | null> {
        const product = await ProductsTable.get('Product', {
            pk: `PRODUCT#${id}`,
            sk: `PRODUCT#${id}`
        });
        return product as Product | null;
    }


    async getByCategoryId(categoryId: string): Promise<Product[]> {
        // Assuming GSI1 is the index name for categories
        const results = await ProductsTable.find('Product', {
            index: 'GSI1',
            GSI1PK: `CATEGORY#${categoryId}`
        });
        return results as Product[];
    }

    async add(product: Product): Promise<Product> {
        // Assuming you have a method to generate unique IDs
        if (!product.Id) product.Id = generateUniqueId();

        // Ensure all required fields are set
        if (!product.Name || !product.Price || !product.Currency || !product.Weight || !product.Category) {
            throw new Error('Incomplete product data');
        }

        await ProductsTable.create('Product', product);
        return product;
    }

    async update(id: string, updatedProductData: Product): Promise<Product | null> {
        const product = await ProductsTable.update('Product', { id, ...updatedProductData }) as Product;
        if (!product) return null;
        return product;
    }

    async delete(id: string): Promise<boolean> {
        (ProductsTable as any).delete({ type: 'Product', id });
        return true;  // Assuming delete is successful
    }

}
