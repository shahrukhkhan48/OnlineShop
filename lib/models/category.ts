import { z } from 'zod';

export const CategorySchema = z.object({
    PK: z.string(),
    SK: z.string(),
    Id: z.string(),
    Name: z.string(),
    Description: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
