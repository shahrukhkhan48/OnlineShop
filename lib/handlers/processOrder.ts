import { SES } from 'aws-sdk';
import * as Handlebars from 'handlebars';
import {OrderRepository} from "../repositories/orderRepository";
import {OrderService} from "../services/orderService";


export const main = async (event: any) => {
    try {

        const repo = new OrderRepository();
        const service = new OrderService(repo);

        const { orderId, customerEmail, ShippingAddress, OrderDetails, orderDate } = event;

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

        const ses = new SES();
        await ses.sendEmail({
            Destination: { ToAddresses: [customerEmail] },
            Message: {
                Body: { Html: { Charset: 'UTF-8', Data: emailHtml } },
                Subject: { Charset: 'UTF-8', Data: 'Order Confirmation: '+orderId }
            },
            Source: 'shahrukh.khan@trilogy.com',
        }).promise();

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error processing order:', error);
        throw new Error('Error processing order');
    }
};
