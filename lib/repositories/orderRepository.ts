import { DynamoDB } from 'aws-sdk';
import { Order } from '../models/order';
import { generateUniqueId } from "./utils";

const dynamoDB = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME as string;
if (!TABLE_NAME) {
    throw new Error('Environment variable TABLE_NAME is not set');
}

export class OrderRepository {

    async placeOrder(orderDate: string,orderId: string, customerEmail: string, ShippingAddress: string, OrderDetails: any[], Status: string): Promise<Order> {
        const order: Order = {
            PK: `ORDER#${orderId}`,
            SK: orderDate,
            Id: orderId,
            CustomerEmail: customerEmail,
            ShippingAddress: ShippingAddress,
            OrderDetails: OrderDetails,
            OrderDate: orderDate,
            Status: Status
        };

        const params = {
            TableName: TABLE_NAME,
            Item: order
        };

        await dynamoDB.put(params).promise();

        return order;
    }

    // New method to update order status
    async updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                PK: `ORDER#${orderId}`,
                SK: 'Your Sort Key Value Here'  // Please replace this with actual SK value
            },
            UpdateExpression: "set #status = :s",
            ExpressionAttributeNames: {
                "#status": "Status"
            },
            ExpressionAttributeValues: {
                ":s": newStatus
            }
        };

        await dynamoDB.update(params).promise();
    }
}
