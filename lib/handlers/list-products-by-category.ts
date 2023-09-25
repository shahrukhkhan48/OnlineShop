import { ProductService } from '../services/product-service';

exports.handler = async (event: any) => {
    const service = new ProductService();

    // Extract categoryId from pathParameters
    const categoryId = event.pathParameters ? parseInt(event.pathParameters.categoryId, 10) : null;

    // Check if categoryId was provided and is valid
    if (!categoryId) {
        return {
            statusCode: 400,
            body: 'Invalid category ID provided'
        };
    }

    try {
        const products = service.listProductsByCategory(categoryId);
        return {
            statusCode: 200,
            body: JSON.stringify(products)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
