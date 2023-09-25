import { z } from 'zod';


export const ProductCategorySchema = z.object({
    Id: z.number(),
    Name: z.string(),
    Description: z.string()
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const SupplierSchema = z.object({
    Id: z.number(),
    Name: z.string()
});

export type Supplier = z.infer<typeof SupplierSchema>;

export const ProductSchema = z.object({
    Id: z.number(),
    Name: z.string(),
    Description: z.string(),
    Price: z.number(),
    Weight: z.number(),
    CategoryId: z.number(), // Adjusted to reference category ID
    SupplierId: z.number(), // Adjusted to reference supplier ID
    ImageUrl: z.string(),
    Category: ProductCategorySchema.optional(),
    Supplier: SupplierSchema.optional(),
});

export type Product = z.infer<typeof ProductSchema>;
