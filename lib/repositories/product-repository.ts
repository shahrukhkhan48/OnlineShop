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

    // Mock products
    private products: Product[] = [
        {
            Id: 1,
            Name: 'Laptop',
            Description: 'High performance laptop for work and play.',
            Price: 1200.00,
            Weight: 1.5,
            Category: { Id: 1, Name: 'Electronics', Description: 'Electrical items like laptops, cameras, and more.' },
            Supplier: { Id: 1, Name: 'TechCorp' },
            ImageUrl: 'https://example.com/laptop.jpg'
        },
        {
            Id: 2,
            Name: 'Sneakers',
            Description: 'Comfortable running shoes.',
            Price: 50.00,
            Weight: 0.3,
            Category: { Id: 3, Name: 'Footwear', Description: 'Different types of shoes, sandals, and boots.' },
            Supplier: { Id: 2, Name: 'ShoeCo' },
            ImageUrl: 'https://example.com/sneakers.jpg'
        },
        {
            Id: 3,
            Name: 'Programming with TypeScript',
            Description: 'Learn the fundamentals of TypeScript development.',
            Price: 35.00,
            Weight: 0.5,
            Category: { Id: 5, Name: 'Books', Description: 'Fiction, non-fiction, academic, and more genres.' },
            Supplier: { Id: 3, Name: 'BookHouse' },
            ImageUrl: 'https://example.com/ts-book.jpg'
        },
        {
            Id: 4,
            Name: 'Lipstick',
            Description: 'Matte finish, long-lasting.',
            Price: 20.00,
            Weight: 0.1,
            Category: { Id: 6, Name: 'Beauty & Personal Care', Description: 'Cosmetics, skincare products, and other personal care essentials.' },
            Supplier: { Id: 4, Name: 'BeautyCorp' },
            ImageUrl: 'https://example.com/lipstick.jpg'
        },
        {
            Id: 5,
            Name: 'Blue Jeans',
            Description: 'Stylish slim-fit jeans for casual wear.',
            Price: 40.00,
            Weight: 0.7,
            Category: { Id: 2, Name: 'Apparel', Description: 'Clothing items including shirts, trousers, and dresses.' },
            Supplier: { Id: 5, Name: 'StyleWear' },
            ImageUrl: 'https://example.com/jeans.jpg'
        },
        {
            Id: 6,
            Name: 'Earphones',
            Description: 'Noise-canceling earphones with deep bass.',
            Price: 25.00,
            Weight: 0.1,
            Category: { Id: 1, Name: 'Electronics', Description: 'Electrical items like laptops, cameras, and more.' },
            Supplier: { Id: 1, Name: 'TechCorp' },
            ImageUrl: 'https://example.com/earphones.jpg'
        }
        // ... Add more mock products as needed ...
    ];


    fetchAllCategories(): ProductCategory[] {
        return this.categories;
    }

    // Inside ProductRepository
    getCategoryById(id: number): ProductCategory | undefined {
        return this.categories.find(category => category.Id === id);
    }

    getProductsByCategory(categoryId: number): Product[] {
        return this.products.filter(product => product.Category.Id === categoryId);
    }

    // Add more methods for other operations
}
