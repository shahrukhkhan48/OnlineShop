import { ProductService } from '../services/product-service';
import { z } from 'zod';

exports.handler = async (event: any) => {
    const service = new ProductService();

    // Validate the input using zod
    const eventSchema = z.object({
        pathParameters: z.object({
            categoryId: z.string()
        })
    });

    try {
        const { pathParameters } = eventSchema.parse(event);
        const categoryId = parseInt(pathParameters.categoryId, 10);
        const category = service.getCategoryById(categoryId);

        if (!category) {
            return {
                statusCode: 404,
                body: 'Category not found'
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(category)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
