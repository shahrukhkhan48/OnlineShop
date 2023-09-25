import { ProductService } from '../services/product-service';

exports.handler = async (event: any) => {
    const service = new ProductService();

    const productId = event.pathParameters?.id;
    if (!productId) {
        return {
            statusCode: 400,
            body: 'Product ID is required.'
        };
    }

    try {
        const product = service.getProductById(Number(productId));
        if (!product) {
            return {
                statusCode: 404,
                body: 'Product not found.'
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(product)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
