import { ProductService } from '../services/product-service';

exports.handler = async (event: any) => {
    const service = new ProductService();

    try {
        const categories = service.fetchAllCategories();
        return {
            statusCode: 200,
            body: JSON.stringify(categories)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};
