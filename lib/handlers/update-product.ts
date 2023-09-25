import { ProductService } from '../services/product-service';

exports.handler = async (event: any) => {
    const service = new ProductService();
    const productId = event.pathParameters.id;
    const productDetails = JSON.parse(event.body);

    try {
        const updatedProduct = service.updateProductById(productId, productDetails);
        return {
            statusCode: 200,
            body: JSON.stringify(updatedProduct)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
