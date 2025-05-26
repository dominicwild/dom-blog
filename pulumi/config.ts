import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as vercel from "@pulumiverse/vercel";
import {Output} from "@pulumi/pulumi";

const environment = pulumi.getStack() as "dev" | "production";
const domain = environment === "production" ? "blog.dominicwild.com" : `${environment}.blog.dominicwild.com`;
const subdomain = domain.replace(".dominicwild.com", "");
const sesIdentity = new aws.ses.DomainIdentity("ses-domain-identity", {
    domain: domain,
});

export const sesEmailDomain = domain

const sesDkim = new aws.ses.DomainDkim("ses-domain-dkim", {
    domain: sesIdentity.domain,
});

const parentDomain = "dominicwild.com";

const lightsail = new aws.Provider("lightsail", {region: "us-east-1"});
const parentZone = aws.lightsail.Domain.get(
    "parentZone",
    parentDomain,
    {domainName: parentDomain},
    {provider: lightsail},
);

sesIdentity.verificationToken.apply(token => {
    return new aws.lightsail.DomainEntry(`ses-verification-record`, {
            domainName: parentZone.domainName,
            name: `_amazonses.${subdomain}`,
            type: "TXT",
            target: `"${token}"`
        },
        {provider: lightsail}
    );
})

new aws.lightsail.DomainEntry(`SPF-record`, {
        domainName: parentZone.domainName,
        name: `${subdomain}`,
        type: "TXT",
        target: `"v=spf1 include:amazonses.com -all"`
    },
    {provider: lightsail}
);

const dkimRecords = sesDkim.dkimTokens.apply(tokens => {
    return tokens.map((token) => {
        return new aws.lightsail.DomainEntry(`ses-dkim-${token.slice(0, 5)}`, {
                domainName: parentZone.domainName,
                name: `${token}._domainkey.${subdomain}`,
                type: "CNAME",
                target: `${token}.dkim.amazonses.com`,
            },
            {provider: lightsail});
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

const backendUser = new aws.iam.User("domblog-backend-user", {
    name: `${environment}-domblog-backend-user`,
    path: "/service/",
});

const backendUserKeys = new aws.iam.AccessKey("electro-backend-user-keys", {
    user: backendUser.name,
});

const backendDynamoPolicy = new aws.iam.Policy("electro-write-only-policy", {
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
                    "dynamodb:BatchWriteItem",
                    "dynamodb:Query"
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
    policyArn: backendDynamoPolicy.arn,
});

if (environment === "production") {
    const sesSendPolicy = new aws.iam.Policy("ses-send-policy", {
        name: `${environment}-ses-send-policy`,
        policy: pulumi
            .all([sesIdentity.arn])
            .apply(([identityArn]) => JSON.stringify({
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow",
                    Action: ["ses:SendEmail", "ses:SendRawEmail"],
                    Resource: identityArn,
                }],
            })),
    });

    new aws.iam.UserPolicyAttachment("attach-ses-send", {
        user: backendUser.name,
        policyArn: sesSendPolicy.arn,
    });
} else {
    const caller = aws.getCallerIdentity();
    const sesWildcardArn = pulumi
        .all([caller, aws.config.region])
        .apply(([whoami, rg]) =>
            `arn:aws:ses:${rg}:${whoami.accountId}:identity/*`
        );

    const sesSendPolicy = new aws.iam.Policy("ses-send-policy", {
        name: pulumi.interpolate`${pulumi.getStack()}-ses-send-policy`,
        policy: sesWildcardArn.apply(arn => JSON.stringify({
            Version: "2012-10-17",
            Statement: [{
                Effect: "Allow",
                Action: ["ses:SendEmail", "ses:SendRawEmail"],
                Resource: arn,
            }],
        })),
    });

    new aws.iam.UserPolicyAttachment("attach-ses-send", {
        user: backendUser.name,
        policyArn: sesSendPolicy.arn,
    });
}

export const backendAccessKeyId = backendUserKeys.id;
export const backendSecretAccessKey = pulumi.secret(backendUserKeys.secret);

// Vercel deployment configuration
let vercelProjectId = process.env.VERCEL_PROJECT_ID!;
const project = vercel.getProjectOutput({name: "dom-blog"});

let deploymentUrl: Output<string>;
if (environment === "dev") {
    deploymentUrl = pulumi.interpolate`dom-blog-git-add-ses-dominics-projects-b72bf392.vercel.app`;
} else {
    deploymentUrl = pulumi.interpolate`${domain}`;
}

// Set vercel environment variables
[
    ["SEND_EMAILS", "true"],
    ["DYNAMO_TABLE_NAME", domBlogTableName],
    ["SES_FROM_EMAIL_DOMAIN", sesIdentity.domain],
    ["AWS_ACCESS_KEY_ID", backendAccessKeyId],
    ["AWS_SECRET_ACCESS_KEY", backendSecretAccessKey],
    ["CRON_SECRET", process.env.CRON_SECRET!],
].forEach(([key, value]) => {
    const targets = environment === "dev" ? ["preview", "development"] : ["production"]
    new vercel.ProjectEnvironmentVariable(`vercel-env-${key}`, {
            projectId: project.id,
            key: key,
            value: value,
            targets: targets,
        },
        {
            deleteBeforeReplace: true,
        }
    );
})