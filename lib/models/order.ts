import { z } from 'zod';

export const OrderSchema = z.object({
    PK: z.string(),
    SK: z.string(),
    Id: z.string(),
    CustomerEmail: z.string(),
    ShippingAddress: z.string(),
    OrderDetails: z.array(
        z.object({
            ProductId: z.string(),
            Quantity: z.number()
        })
    ),
    OrderDate: z.string(),
    Status: z.string()
});

export type Order = z.infer<typeof OrderSchema>;
