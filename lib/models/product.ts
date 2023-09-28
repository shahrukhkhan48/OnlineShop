import { z } from 'zod';

export const ProductSchema = z.object({
    Id: z.string(),
    Name: z.string(),
    Description: z.string().optional(),
    Price: z.number(),
    Currency: z.string(),
    Weight: z.number(),
    ImageUrl: z.string().optional(),
    Supplier: z.string().optional(),
    Category: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
