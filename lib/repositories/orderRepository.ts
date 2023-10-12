import { DynamoDB, SES } from 'aws-sdk';
import { Order } from '../models/order';
import * as Handlebars from 'handlebars';


const dynamoDB = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME as string;
if (!TABLE_NAME) {
    throw new Error('Environment variable TABLE_NAME is not set');
}

export class OrderRepository {

    async placeOrder(orderId: string, orderDate: string, customerEmail: string, ShippingAddress: string, OrderDetails: any[]): Promise<Order> {

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

        const source = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8; }
                    .email-container { padding: 20px; max-width: 600px; margin: auto; background-color: #fff; border: 1px solid #ddd; }
                    p { margin: 0 0 15px; }
                    h2 { color: #333; margin-bottom: 15px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .footer { font-size: 12px; color: #888; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <p>Dear Customer,</p>
                    <p>Thank you for your order!</p>
                    <h2>Order Details</h2>
                    <p><strong>Order ID:</strong> {{orderId}}</p>
                    <p><strong>Date:</strong> {{orderDate}}</p>
                    <p><strong>Shipping Address:</strong> {{ShippingAddress}}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{#each OrderDetails}}
                                <tr>
                                    <td>{{ProductId}}</td>
                                    <td>{{Quantity}}</td>
                                </tr>
                            {{/each}}
                        </tbody>
                    </table>
                    <p>We appreciate your business and hope you enjoy your purchase!</p>
                    <p>Kind regards,</p>
                    <p>Trilogy Team</p>
                </div>
            </body>
            </html>
            `;
        const template = Handlebars.compile(source);
        const emailHtml = template({ orderId, orderDate, ShippingAddress, OrderDetails });

        const emailParams = {
            Destination: { ToAddresses: [customerEmail] },
            Message: {
                Body: { Html: { Charset: 'UTF-8', Data: emailHtml } },
                Subject: { Charset: 'UTF-8', Data: 'Order Confirmation: ' + orderId }
            },
            Source: 'shahrukh.khan@trilogy.com',
        };

        const ses = new SES();
        await ses.sendEmail(emailParams).promise();

        return order;
    }

}
