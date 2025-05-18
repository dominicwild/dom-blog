import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const environment = pulumi.getStack();
const domain = environment === "production" ? "blog.dominicwild.com" : `${environment}.blog.dominicwild.com`;
const sesIdentity = new aws.ses.DomainIdentity("ses-domain-identity", {
    domain: domain,
});

// SES DKIM
const sesDkim = new aws.ses.DomainDkim("ses-domain-dkim", {
    domain: sesIdentity.domain,
});

// Export SES identity ARN and verification tokens
export const sesIdentityArn = sesIdentity.arn;
export const sesDkimTokens = sesDkim.dkimTokens;


const zone = new aws.route53.Zone("blog-domain", {
    name: domain,
});

const verificationRecord = new aws.route53.Record("ses-verification-record", {
    zoneId: zone.zoneId,
    name: `_amazonses.${domain}`,
    type: "TXT",
    ttl: 600,
    records: [sesIdentity.verificationToken],
});

const dkimRecords = sesDkim.dkimTokens.apply(tokens => {
    return tokens.map((token, index) => {
        return new aws.route53.Record(`ses-dkim-record-${index}`, {
            zoneId: zone.zoneId,
            name: `${token}._domainkey.${domain}`,
            type: "CNAME",
            ttl: 600,
            records: [`${token}.dkim.amazonses.com`],
        });
    });
});

const blogEmailTable = new aws.dynamodb.Table("dom-blog-table", {
    name: `${environment}-dom-blog`,
    attributes: [
        {name: "pk", type: "S"},
        {name: "sk", type: "S"},
        {name: "gsi1pk", type: "S"},
        {name: "gsi1sk", type: "S"},
    ],
    hashKey: "pk",
    rangeKey: "sk",
    billingMode: "PAY_PER_REQUEST",
    globalSecondaryIndexes: [
        {
            name: "gsi1pk-gsi1sk-index",
            hashKey: "gsi1pk",
            rangeKey: "gsi1sk",
            projectionType: "ALL",
        },
    ],
});

export const domBlogTableName = blogEmailTable.name;
export const domBlogTableArn = blogEmailTable.arn

const backendUser = new aws.iam.User("domblog-backend-user", {
    name: `${environment}-domblog-backend-user`,
    path: "/service/",
});

const backendUserKeys = new aws.iam.AccessKey("electro-backend-user-keys", {
    user: backendUser.name,
});

const writeOnlyPolicy = new aws.iam.Policy("electro-write-only-policy", {
    name: `${environment}-electro-write-only-policy`,
    policy: blogEmailTable.arn.apply(tableArn => JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:BatchWriteItem"
                ],
                Resource: [
                    tableArn,
                    `${tableArn}/index/*`
                ]
            }
        ]
    }))
});

const policyAttachment = new aws.iam.UserPolicyAttachment("domblog-policy-attachment", {
    user: backendUser.name,
    policyArn: writeOnlyPolicy.arn,
});

export const backendAccessKeyId = backendUserKeys.id;
export const backendSecretAccessKey = pulumi.secret(backendUserKeys.secret);