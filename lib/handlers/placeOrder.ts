import { APIGatewayProxyHandler } from 'aws-lambda';
import jwtDecode from 'jwt-decode';
import { StepFunctions } from "aws-sdk";
import { OrderService } from "../services/orderService";
import { OrderRepository } from "../repositories/orderRepository";
import {sendEmail} from "../repositories/utils";

const repo = new OrderRepository();
const orderService = new OrderService(repo);

interface PlaceOrderEvent {
    request?: {
        headers?: {
            authorization?: string;
        };
    };
    arguments?: {
        order?: {
            shippingAddress: string;
            orderDetails: { productId: string, quantity: number }[];
        };
    };
}

export const main: APIGatewayProxyHandler = async (event: any): Promise<any> => {
    try {
        const token = event.request?.headers?.authorization;

        if (!token) {
            console.error('No token provided');
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized' }),
            };
        }

        const decodedToken: any = jwtDecode(token);
        const customerEmail = decodedToken.email;

        const order = event.arguments?.order;
        const { shippingAddress, orderDetails } = order;

        const orderDate = new Date().toISOString();
        const orderId = `ORD-${new Date().getTime()}`;
        const orderStatus = 'PLACED';

        await orderService.placeOrder(orderDate, orderId, customerEmail, shippingAddress, orderDetails, orderStatus);

        const subject = `Order Placed: ${orderId}`;
        const templateSource = `
            <html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    <div style="padding: 20px; background-color: #f8f8f8;">
                        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 5px;">
                            <h2 style="color: #333366;">Thank you for your order, {{customerEmail}}!</h2>
                            <p>Your order ID is: <strong>{{orderId}}</strong></p>
                            <p>We will notify you once your order has been shipped.</p>
                            <hr>
                            <p>If you have any questions or need assistance with your order, please contact our <a href="mailto:support@example.com">Customer Support</a>.</p>
                            <p><a href="https://yourwebsite.com/order/{{orderId}}" target="_blank" style="background-color: #333366; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">View Order Status</a></p>
                        </div>
                        <p style="text-align: center; margin-top: 20px; color: #666;">&copy; 2023 YourWebsite. All Rights Reserved.</p>
                    </div>
                </body>
            </html>
        `;

        await sendEmail(
            orderId,
            customerEmail,
            subject,
            templateSource,
            { orderId, customerEmail }
        );


        const stepfunctions = new StepFunctions();
        const stateMachineArn = process.env.STATE_MACHINE_ARN;

        if (!stateMachineArn) {
            console.error('STATE_MACHINE_ARN is not defined');
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal Server Error' }),
            };
        }

        const params = {
            stateMachineArn,
            name: `OrderProcessing-${new Date().getTime()}`,
            input: JSON.stringify({
                orderId,
                customerEmail,
                shippingAddress,
                orderDetails,
                orderDate,
            })
        };

        const execution = await stepfunctions.startExecution(params).promise();

        console.log('Step Function Started:', execution);

        return {
            statusCode: 200,
            body: JSON.stringify({
                Id: orderId,
                OrderDate: orderDate,
                CustomerEmail: customerEmail,
                ShippingAddress: shippingAddress,
                OrderDetails: orderDetails
            }),
        };
    } catch (error) {
        console.error('Error placing order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error placing order' }),
        };
    }
};
