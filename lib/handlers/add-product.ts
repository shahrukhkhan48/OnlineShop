import { ProductService } from '../services/product-service';

exports.handler = async (event: any) => {
    const service = new ProductService();

    try {
        const body = JSON.parse(event.body || '{}');
        const addedProduct = service.addProduct(body);

        return {
            statusCode: 201,
            body: JSON.stringify(addedProduct)
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
