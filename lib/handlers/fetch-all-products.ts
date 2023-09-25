import { ProductService } from '../services/product-service';

exports.handler = async (event: any) => {
    const service = new ProductService();

    try {
        const products = service.fetchAllProducts();
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
