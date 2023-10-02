import { DynamoDB } from 'aws-sdk';
import { Order } from '../models/order';

const dynamoDB = new DynamoDB.DocumentClient();

// Asserting that TABLE_NAME is a string. If it's undefined, throw an error.
const TABLE_NAME = process.env.TABLE_NAME as string;
if (!TABLE_NAME) {
    throw new Error('Environment variable TABLE_NAME is not set');
}

export class OrderRepository {
    generateUniqueId(): string {
        // Implement the UUID generator or another unique ID method here.
        // For this example, I'm returning a placeholder. You should replace this with your UUID logic.
        return `unique-id-${Date.now()}`;
    }

    async placeOrder(customerEmail: string, ShippingAddress: string, OrderDetails: any[]): Promise<Order> {
        const orderDate = new Date().toISOString();
        const orderId = this.generateUniqueId();

        const order: Order = {
            Id: orderId,
            CustomerEmail: customerEmail,
            ShippingAddress: ShippingAddress,
            OrderDetails: OrderDetails,
            OrderDate: orderDate
        };


        const params = {
            TableName: TABLE_NAME,
            Item: order
        };

        await dynamoDB.put(params).promise();

        return order;
    }
}
