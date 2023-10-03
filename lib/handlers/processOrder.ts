import { SES } from 'aws-sdk';
import * as Handlebars from 'handlebars';

export const main = async (event: any) => {
    try {
        // Extracting order details from the event object
        const { customerEmail, ShippingAddress, OrderDetails, orderDate } = event;

        // Generate email content using Handlebars
        const source = `
        <p>Thank you for your order!</p>
        <p>Order Details:</p>
        <p>Date: {{orderDate}}</p>
        <p>Shipping Address: {{ShippingAddress}}</p>
        <p>Items:</p>
        <ul>
            {{#each OrderDetails}}
                <li>{{Quantity}} x {{ProductId}}</li>
            {{/each}}
        </ul>
        `;
        const template = Handlebars.compile(source);
        const emailHtml = template({ orderDate, ShippingAddress, OrderDetails });

        // Send email using SES
        const ses = new SES();
        await ses.sendEmail({
            Destination: { ToAddresses: [customerEmail] },
            Message: {
                Body: { Html: { Charset: 'UTF-8', Data: emailHtml } },
                Subject: { Charset: 'UTF-8', Data: 'Order Confirmation' }
            },
            Source: 'shahrukh.khan@trilogy.com', // Replace with your SES verified email address
        }).promise();

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error processing order:', error);
        throw new Error('Error processing order');
    }
};
