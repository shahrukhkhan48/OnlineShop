import { APIGatewayProxyHandler } from 'aws-lambda';
import jwtDecode from 'jwt-decode';
import { StepFunctions } from "aws-sdk";

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
        const { ShippingAddress, OrderDetails } = order;

        const orderDate = new Date().toISOString();

        const stepfunctions = new StepFunctions();
        const stateMachineArn = process.env.STATE_MACHINE_ARN;

        if (!stateMachineArn) {
            console.error('STATE_MACHINE_ARN is not defined');
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal Server Error' }),
            };
        }

        const orderId = `ORD-${new Date().getTime()}`;

        const params = {
            stateMachineArn,
            name: `OrderProcessing-${new Date().getTime()}`,
            input: JSON.stringify({
                orderId,
                customerEmail,
                ShippingAddress,
                OrderDetails,
                orderDate,
            })
        };

        const execution = await stepfunctions.startExecution(params).promise();

        return `Order placed successfully! Order ID: ${orderId}, Customer Email: ${customerEmail}`;
    } catch (error) {
       return 'Error placing order: '+ error;
    }
};
