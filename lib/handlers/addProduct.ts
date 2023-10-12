import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { Product } from '../models/product';

interface ProductArguments {
    product: Product;
}

interface AppSyncEvent {
    arguments: ProductArguments;
}
export async function main(event: AppSyncEvent): Promise<Product> {
    const service = new ProductService( );

    const productData: Product = event.arguments.product;

    const newProduct = await service.addProduct(productData);

    if (!newProduct || !newProduct.Name || !newProduct.Price || !newProduct.Currency || !newProduct.Weight || !newProduct.Category) {
        throw new Error('Incomplete product data returned from service');
    }

    return newProduct;
}
