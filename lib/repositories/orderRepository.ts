import { DynamoDB } from 'aws-sdk';
import { Order } from '../models/order';
import {generateUniqueId} from "./utils";

const dynamoDB = new DynamoDB.DocumentClient();

// Asserting that TABLE_NAME is a string. If it's undefined, throw an error.
const TABLE_NAME = process.env.TABLE_NAME as string;
if (!TABLE_NAME) {
    throw new Error('Environment variable TABLE_NAME is not set');
}

export class OrderRepository {

    async placeOrder(customerEmail: string, ShippingAddress: string, OrderDetails: any[]): Promise<Order> {
        const orderDate = new Date().toISOString();
        const orderId = generateUniqueId();

        const order: Order = {
            PK: `ORDER#${orderId}`,
            SK: orderDate,
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
