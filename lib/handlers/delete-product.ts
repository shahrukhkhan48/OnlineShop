import { ProductService } from '../services/product-service';

exports.handler = async (event: any) => {
    const service = new ProductService();
    const productId = parseInt(event.pathParameters.id);

    try {
        service.deleteProductById(productId);
        return {
            statusCode: 200,
            body: `Product with ID: ${productId} deleted successfully.`
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
            };
        } else {
            return {
                statusCode: 500,
                // body: 'Internal Server Error'
                body: JSON.stringify({ message: 'Internal Server Error', error: error })
            };
        }
    }
};
