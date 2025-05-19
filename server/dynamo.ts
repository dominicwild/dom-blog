"use server"

import {Entity} from "electrodb";

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {createHmac} from "node:crypto";
import {sendEmail} from "@/server/email";


export async function getDb() {

    const client = new DynamoDBClient({
        region: "eu-west-1"
    });

    const table = process.env.DYNAMO_TABLE_NAME;

    const Email = new Entity(
        {
            model: {
                entity: "emails",
                version: "1",
                service: "blog",
            },
            attributes: {
                id: {
                    type: "string",
                    required: true,
                    default: () => crypto.randomUUID()
                },
                email: {
                    type: "string",
                },
                emailHash: {
                    type: "string",
                    required: true,
                }
            },
            indexes: {
                byEmailHash: {
                    pk: {
                        field: "pk",
                        composite: ["emailHash"]
                    },
                    sk: {
                        field: "sk",
                        composite: ["emailHash"]
                    }
                },
                byId: {
                    index: "gsi1pk-gsi1sk-index",
                    pk: {
                        field: "gsi1pk",
                        composite: ["id"]
                    },
                    sk: {
                        field: "gsi1sk",
                        composite: ["id"]
                    }
                }
            },
        },
        {client, table},
    );

    return {Email}
}

function hash(value: string) {
    return createHmac("sha256", process.env.HASH_KEY!).update(value).digest("hex");
}

export async function submitEmail(email: string) {
    const db = await getDb();

    const emailHash = hash(email)
    const emailExists = await db.Email.query.byEmailHash({
        emailHash
    }).go()

    if (emailExists.data.length > 0) {
        return;
    }

    const result = await db.Email.put({
        emailHash: hash(email),
    }).go();
    const record = result.data;


    const confirmationLink = `${process.env.VERCEL_PROJECT_PRODUCTION_URL!}/confirm?email=${encodeURIComponent(email)}&id=${encodeURIComponent(record.id)}`;
    const unsubscribeLink = `${process.env.VERCEL_PROJECT_PRODUCTION_URL!}/unsubscribe?email=${encodeURIComponent(email)}&id=${encodeURIComponent(record.id)}`;

    return await sendEmail({
        to: email,
        subject: "Confirm your subscription to Dominic's Blog",
        htmlBody: `
            <h1>Thanks for subscribing!</h1>
            <p>
                Please confirm your email at&#32;
                <a href="${confirmationLink}">this link</a>
                and then you will receive updates when articles are posted!
            </p>
            <p>Best regards,<br>Dominic</p>
            <small>If you wish to unsubscribe, use&#32;
            <a href="${unsubscribeLink}">this link</a>.
            </small>
        `,
        textBody: "Please confirm your email for blog updates. Best regards, Dominic"
    });
}

export async function confirmEmailSubscription(id: string, email: string) {
    const emailHash = hash(email);
    const db = await getDb();
    const {data} = await db.Email.query.byId({id}).go();

    if (data.length === 0) {
        throw new Error("Could not find provided email address.");
    }
    if (data.length !== 1) {
        throw new Error("Duplicate ID exists.");
    }

    const record = data[0]

    const isVerified = record.emailHash === emailHash

    if (isVerified && !record.email) {
        await db.Email.put({
            emailHash,
            id,
            email,
        }).go();
    }

    return isVerified;
}

export async function removeEmailSubscription(id: string, email: string) {
    const emailHash = hash(email);
    const db = await getDb();
    const {data} = await db.Email.query.byId({id}).go();

    if (data.length === 0) {
        throw new Error("Could not find provided email address.");
    }

    for (let record of data) {
        const isVerified = record.emailHash === emailHash

        if (isVerified) {
            await db.Email.delete({
                emailHash: record.emailHash
            }).go();
        }
    }
}