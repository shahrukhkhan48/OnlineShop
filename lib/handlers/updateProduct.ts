import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { Product, ProductSchema } from '../models/product';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { z } from "zod";

interface AppSyncEvent {
    arguments: {
        [key: string]: any;
    };
}

export async function main(event: AppSyncEvent) {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    try {
        const id = event.arguments?.Id;
        const productData = event.arguments;

        const updatedProduct = await service.updateProduct(id, productData as Product);

        return updatedProduct;

    } catch (error) {
        console.error('Error occurred:', error);  // Log the error for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
}
