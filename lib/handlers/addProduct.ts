import { ProductService } from '../services/productService';
import { ProductRepository } from '../repositories/productRepository';
import { Product } from '../models/product';

export async function main(event: any): Promise<Product> {
    const repo = new ProductRepository();
    const service = new ProductService(repo);

    const productData: Product = event.arguments.product;

    const newProduct = await service.addProduct(productData);  // Note the 'await' here

    if (!newProduct || !newProduct.Name || !newProduct.Price || !newProduct.Currency || !newProduct.Weight || !newProduct.Category) {
        throw new Error('Incomplete product data returned from service');
    }

    return newProduct;
}
