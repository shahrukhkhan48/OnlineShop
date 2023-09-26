import { ProductService } from '../services/product-service';

exports.handler = async (event: any) => {
    const service = new ProductService();
    const productId = parseInt(event.pathParameters.id);
    const productDetails = JSON.parse(event.body);

    if (productDetails.Id && productDetails.Id !== productId) {
        return {
            statusCode: 400,
            body: 'Product Id in the request body should not be provided or should match the Id in the path.'
        };
    }

    try {
        const updatedProduct = service.updateProductById(productId, productDetails);
        return {
            statusCode: 200,
            body: JSON.stringify(updatedProduct)
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
