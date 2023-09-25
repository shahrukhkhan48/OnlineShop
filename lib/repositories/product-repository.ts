import {Product, ProductCategory, Supplier} from '../models/product';

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
            Description: 'A high-end gaming laptop',
            Price: 1500,
            Weight: 2.5,
            CategoryId: 1, // Assuming Electronics
            SupplierId: 1,
            ImageUrl: 'image1-url'
        },
        {
            Id: 2,
            Name: 'Novel',
            Description: 'A bestselling novel',
            Price: 20,
            Weight: 0.5,
            CategoryId: 5, // Assuming Books
            SupplierId: 3,
            ImageUrl: 'image2-url'
        },
        {
            Id: 3,
            Name: 'Running Shoes',
            Description: 'Comfortable and durable running shoes',
            Price: 80,
            Weight: 1,
            CategoryId: 3, // Assuming Footwear
            SupplierId: 5,
            ImageUrl: 'image3-url'
        },
        {
            Id: 4,
            Name: 'Shirt',
            Description: 'Cotton casual shirt',
            Price: 25,
            Weight: 0.3,
            CategoryId: 2, // Assuming Apparel
            SupplierId: 2,
            ImageUrl: 'image4-url'
        },
        {
            Id: 5,
            Name: 'Organic Apples',
            Description: 'Pack of 12 fresh organic apples',
            Price: 12,
            Weight: 1.2,
            CategoryId: 4, // Assuming Groceries
            SupplierId: 4,
            ImageUrl: 'image5-url'
        }
    ];

    // Mock Suppliers
    private suppliers: Supplier[] = [
        { Id: 1, Name: 'Tech Titans' },
        { Id: 2, Name: 'Fashion Forward' },
        { Id: 3, Name: 'Book Bazaar' },
        { Id: 4, Name: 'Grocery Giants' },
        { Id: 5, Name: 'Footwear Fiesta' }
    ];

    fetchAllCategories(): ProductCategory[] {
        return this.categories;
    }

    // Inside ProductRepository
    getCategoryById(id: number): ProductCategory | undefined {
        return this.categories.find(category => category.Id === id);
    }

    getProductsByCategory(categoryId: number): Product[] {
        let productsInCategory = this.products.filter(product => product.CategoryId === categoryId);

        productsInCategory = productsInCategory.map(product => {
            const productCategory = this.categories.find(category => category.Id === product.CategoryId);
            const productSupplier = this.suppliers.find(supplier => supplier.Id === product.SupplierId);

            return {
                ...product,
                Category: productCategory,   // replace CategoryId with full Category object
                Supplier: productSupplier   // replace SupplierId with full Supplier object
            };
        });

        return productsInCategory;
    }

    getProductById(productId: number): Product | undefined {
        const product = this.products.find(p => p.Id === productId);

        if (!product) return undefined;

        const productCategory = this.categories.find(category => category.Id === product.CategoryId);
        const productSupplier = this.suppliers.find(supplier => supplier.Id === product.SupplierId);

        return {
            ...product,
            Category: productCategory,   // replace CategoryId with full Category object
            Supplier: productSupplier   // replace SupplierId with full Supplier object
        };
    }

    fetchAllProducts(): Product[] {
        return this.products.map(product => {
            const productCategory = this.categories.find(category => category.Id === product.CategoryId);
            const productSupplier = this.suppliers.find(supplier => supplier.Id === product.SupplierId);

            return {
                ...product,
                Category: productCategory,
                Supplier: productSupplier
            };
        });
    }

    addProduct(newProduct: Product): Product {
        // Normally, this ID assignment would be handled by your database.
        const newId = this.products.length + 1;
        const product = {
            ...newProduct,
            Id: newId
        };

        this.products.push(product);
        return product;
    }

    updateProductById(productId: number, productDetails: Product): Product {
        const index = this.products.findIndex(product => product.Id === productId);
        if (index === -1) {
            throw new Error("Product not found");
        }
        this.products[index] = {...this.products[index], ...productDetails};
        return this.products[index];
    }

    getSupplierById(id: number): Supplier | undefined {
        return this.suppliers.find(supplier => supplier.Id === id);
    }

    // Add more methods for other operations
}