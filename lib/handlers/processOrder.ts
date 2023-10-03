import { SES } from 'aws-sdk';
import * as Handlebars from 'handlebars';

export const main = async (event: any) => {
    try {
        const { customerEmail, ShippingAddress, OrderDetails, orderDate } = event;

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

        const ses = new SES();
        await ses.sendEmail({
            Destination: { ToAddresses: [customerEmail] },
            Message: {
                Body: { Html: { Charset: 'UTF-8', Data: emailHtml } },
                Subject: { Charset: 'UTF-8', Data: 'Order Confirmation' }
            },
            Source: 'shahrukh.khan@trilogy.com',
        }).promise();

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error processing order:', error);
        throw new Error('Error processing order');
    }
};
