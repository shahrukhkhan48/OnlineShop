import { SES } from 'aws-sdk';
import * as Handlebars from 'handlebars';
import { OrderService } from "../services/orderService";
import { OrderRepository } from "../repositories/orderRepository";
import {sendEmail} from "../repositories/utils";

// Ensure to replace [YOUR_TABLE_NAME] with the actual DynamoDB table name
const repo = new OrderRepository();
const orderService = new OrderService(repo);


interface ProcessOrderEvent {
    orderId: string;
    customerEmail: string;
    shippingAddress: string;
    orderDetails: { productId: string, quantity: number }[];
    orderDate: string;
}

export const main = async (event: ProcessOrderEvent) => {
    try {
        const { orderId, customerEmail, shippingAddress, orderDetails, orderDate } = event;
        console.log('Shipping Address:', shippingAddress);
        console.log('Order Details:', orderDetails);

        const subject = `Order Shipped: ${orderId}`;
        const templateSource = `
            <html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    <div style="padding: 20px; background-color: #f8f8f8;">
                        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 5px;">
                            <h2 style="color: #333366;">Thank you for your order, {{customerEmail}}!</h2>
                            <p>Your order ID is: <strong>{{orderId}}</strong></p>
                            <p>Order Date: <strong>{{orderDate}}</strong></p>
                            <p>Shipping Address: <strong>{{shippingAddress}}</strong></p>
                            <h3>Items:</h3>
                            <ul>
                                {{#each orderDetails}}
                                    <li>{{quantity}} x {{productId}}</li>
                                {{/each}}
                            </ul>
                            <p>Your order has been shipped and is on its way!</p>
                            <hr>
                            <p>If you have any questions or need assistance with your order, please contact our <a href="mailto:support@example.com">Customer Support</a>.</p>
                            <p><a href="https://yourwebsite.com/order/{{orderId}}" target="_blank" style="background-color: #333366; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Track Your Order</a></p>
                        </div>
                        <p style="text-align: center; margin-top: 20px; color: #666;">&copy; 2023 YourWebsite. All Rights Reserved.</p>
                    </div>
                </body>
            </html>
        `;

        await sendEmail(orderId, customerEmail, subject, templateSource, {
                orderId,
                orderDate,
                shippingAddress,
                orderDetails
            });


        console.log('Email sent successfully');

        await orderService.updateOrderStatus(orderId, 'PROCESSED');

    } catch (error) {
        console.error('Error processing order:', error);
        throw new Error('Error processing order');
    }
};
