import { z } from 'zod';

export const ProductSchema = z.object({
    Id: z.number(),
    Name: z.string(),
    Description: z.string(),
    Price: z.number(),
    Weight: z.number(),
    Category: z.object({
        Id: z.number(),
        Name: z.string(),
        Description: z.string()
    }),
    Supplier: z.object({
        Id: z.number(),
        Name: z.string()
    }),
    ImageUrl: z.string()
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductCategorySchema = z.object({
    Id: z.number(),
    Name: z.string(),
    Description: z.string()
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

// Adding a schema for Supplier if you need it elsewhere
export const SupplierSchema = z.object({
    Id: z.number(),
    Name: z.string()
});

export type Supplier = z.infer<typeof SupplierSchema>;
