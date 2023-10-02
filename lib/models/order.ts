import { z } from 'zod';

export const OrderSchema = z.object({
    Id: z.string(),
    CustomerEmail: z.string(),
    ShippingAddress: z.string(),
    OrderDetails: z.array(
        z.object({
            ProductId: z.string(),
            Quantity: z.number()
        })
    ),
    OrderDate: z.string()
});

export type Order = z.infer<typeof OrderSchema>;
