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
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
