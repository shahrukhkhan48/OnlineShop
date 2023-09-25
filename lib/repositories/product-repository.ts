import { Product, ProductCategory } from '../models/product';

export class ProductRepository {
    // Mock data
    private categories: ProductCategory[] = [
        { Id: 1, Name: 'Electronics', Description: 'Electrical items like laptops, cameras, and more.' },
        { Id: 2, Name: 'Apparel', Description: 'Clothing items including shirts, trousers, and dresses.' },
        { Id: 3, Name: 'Footwear', Description: 'Different types of shoes, sandals, and boots.' },
        { Id: 4, Name: 'Groceries', Description: 'Essential food and household items.' },
        { Id: 5, Name: 'Books', Description: 'Fiction, non-fiction, academic, and more genres.' },
        { Id: 6, Name: 'Beauty & Personal Care', Description: 'Cosmetics, skincare products, and other personal care essentials.' }
    ];

    fetchAllCategories(): ProductCategory[] {
        return this.categories;
    }

    // Inside ProductRepository
    getCategoryById(id: number): ProductCategory | undefined {
        return this.categories.find(category => category.Id === id);
    }


    // Add more methods for other operations
}
