import { APIGatewayProxyHandler } from 'aws-lambda';
import jwtDecode from 'jwt-decode';
import { StepFunctions } from "aws-sdk";

export const main: APIGatewayProxyHandler = async (event: any): Promise<any> => {
    try {
        // Extracting the token
        const token = event.request?.headers?.authorization;

        if (!token) {
            console.error('No token provided');
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized' }),
            };
        }

        // Decode token
        const decodedToken: any = jwtDecode(token);
        const customerEmail = decodedToken.email;

        const order = event.arguments?.order;
        const { ShippingAddress, OrderDetails } = order;

        // Get the current date
        const orderDate = new Date().toISOString();

        console.log(`Email: ${customerEmail}, Address: ${ShippingAddress}, Date: ${orderDate}`);
        console.log('Order Details:', OrderDetails);

        // Start Step Function
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
            name: `OrderProcessing-${new Date().getTime()}`, // Ensuring the name is unique
            input: JSON.stringify({
                customerEmail,
                ShippingAddress,
                OrderDetails,
                orderDate,
            })
        };

        const execution = await stepfunctions.startExecution(params).promise();

        console.log('Step Function Started:', execution);

        // Generating a dummy order ID for this example. In a real-world scenario, you might want to use a value from the execution result, a UUID, or a value from a database.
        const orderId = `ORD-${new Date().getTime()}`;

        // Returning the order information in the response, matching your GraphQL schema
        return {
            statusCode: 200,
            body: JSON.stringify({
                Id: orderId,
                OrderDate: orderDate,
                CustomerEmail: customerEmail,
                ShippingAddress: ShippingAddress,
                OrderDetails: OrderDetails
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
