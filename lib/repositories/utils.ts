import { SES } from 'aws-sdk';
import * as Handlebars from 'handlebars';

export function generateUniqueId(): string {
    return Date.now().toString();
}



const ses = new SES();

export async function sendEmail(
    orderId: string,
    customerEmail: string,
    subject: string,
    templateSource: string,
    templateData: object
) {
    const template = Handlebars.compile(templateSource);
    const emailHtml = template(templateData);

    const sourceEmail = 'shahrukh.khan@trilogy.com';

    await ses.sendEmail({
        Destination: { ToAddresses: [customerEmail] },
        Message: {
            Body: { Html: { Charset: 'UTF-8', Data: emailHtml } },
            Subject: { Charset: 'UTF-8', Data: subject }
        },
        Source: sourceEmail,
    }).promise();
}
