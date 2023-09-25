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
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
