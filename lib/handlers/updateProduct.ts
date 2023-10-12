import { ProductService } from '../services/productService';
import { Product } from '../models/product';

interface UpdateProductArgs {
    Id: string;
    Name?: string;
    Description?: string;
    Price?: number;
    Currency?: string;
    Weight?: number;
    ImageUrl?: string;
    Supplier?: string;
    Category?: string;
}

interface AppSyncEvent {
    arguments: UpdateProductArgs;
}

export async function main(event: AppSyncEvent): Promise<Product> {
    const service = new ProductService();
    const { Id, ...productData } = event.arguments;

    const updatedProduct = await service.updateProduct(Id, productData);

    if (!updatedProduct) {
        throw new Error(`Product with ID ${Id} not found or update failed`);
    }
    return updatedProduct;
}



