"use server"

import {SESClient, SendEmailCommand} from "@aws-sdk/client-ses";

const sesClient = new SESClient({
    region: "eu-west-1"
});

type EmailParams = {
    to: string | string[];
    subject: string;
    htmlBody: string;
    textBody?: string;
    replyTo?: string | string[];
}

export async function sendEmail({
                                    to,
                                    subject,
                                    htmlBody,
                                    textBody,
                                    replyTo
                                }: EmailParams) {

    if (process.env.SEND_EMAILS === "false") {
        console.log(`Sent email with body ${htmlBody}`)
        return;
    }

    const toAddresses = Array.isArray(to) ? to : [to];
    const replyToAddresses = replyTo ? (Array.isArray(replyTo) ? replyTo : [replyTo]) : undefined;
    const sourceEmail = `blog@${process.env.SES_FROM_EMAIL_DOMAIN}`

    const command = new SendEmailCommand({
        Source: sourceEmail,
        Destination: {
            ToAddresses: toAddresses,
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: "UTF-8",
            },
            Body: {
                Html: {
                    Data: htmlBody,
                    Charset: "UTF-8",
                },
                ...(textBody && {
                    Text: {
                        Data: textBody,
                        Charset: "UTF-8",
                    }
                }),
            },
        },
        ...(replyToAddresses && {ReplyToAddresses: replyToAddresses}),
    });

    try {
        const response = await sesClient.send(command);
        return {success: true, messageId: response.MessageId};
    } catch (error) {
        console.error("Error sending email:", error);
        return {success: false, error};
    }
}