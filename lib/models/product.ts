import { z } from 'zod';

export const ProductSchema = z.object({
    Id: z.number(),
    Name: z.string(),
    Description: z.string(),
    Price: z.bigint(),
    Weight: z.number(),
    Category: z.object({
        Id: z.number(),
        Name: z.string(),
        Description: z.string()
    }),
    Supplier: z.string(), // Adjust as needed
    ImageUrl: z.string()
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductCategorySchema = z.object({
    Id: z.number(),
    Name: z.string(),
    Description: z.string()
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;
