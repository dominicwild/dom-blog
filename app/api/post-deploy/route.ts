import {createHmac} from "node:crypto";
import {createUnsubscribeLink, getDb} from "@/server/dynamo";
import {getAllArticleParams, getArticleMetaData} from "@/articles/getArticles";
import {sendEmail} from "@/server/email";
import {createNewArticleEmailTemplate} from "@/app/api/post-deploy/emailBuilder";

type DeploymentSucceededPayload = {
    team: {
        id: string | null;
    };
    user: {
        id: string;
    };
    deployment: {
        id: string;
        meta: Record<string, unknown>;
        url: string;
        name: string;
    };
    links: {
        deployment: string;
        project: string;
    };
    target: 'production' | 'staging' | null;
    project: {
        id: string;
    };
    plan: string;
    regions: string[];
}

export async function POST(request: Request) {
    const {VERCEL_WEBHOOK_SECRET} = process.env;

    if (typeof VERCEL_WEBHOOK_SECRET != 'string') {
        throw new Error('No integration secret found');
    }


    const rawBody = await request.text();
    const rawBodyBuffer = Buffer.from(rawBody, 'utf-8');
    const bodySignature = sha1(rawBodyBuffer, VERCEL_WEBHOOK_SECRET);

    // if (bodySignature !== request.headers.get('x-vercel-signature')) {
    //     return Response.json({
    //         code: 'invalid_signature',
    //         error: "signature didn't match",
    //     });
    // }

    const json = JSON.parse(rawBodyBuffer.toString('utf-8'));

    switch (json.type) {
        case 'deployment.succeeded':
            const deploymentRequest = json as DeploymentSucceededPayload;
            if (deploymentRequest.deployment.url === "blog.dominicwild.com") {
                await sendNewArticleEmail();
            }
    }

    return new Response('Webhook request validated', {
        status: 200,
    });
}

function sha1(data: Buffer, secret: string): string {
    return createHmac('sha1', secret).update(data).digest('hex');
}

const ARTICLE_LIST_ID = "1" as const;

async function getAllEmails() {
    const {Email} = await getDb();
    const {data} = await Email.scan
        .where(({email}, {exists}) => exists(email))
        .go();

    return data;
}


async function getMissingArticleMetaData(missingArticles: string[]) {
    const articleMetaData = await Promise.all(missingArticles.map(article => getArticleMetaData(article)));

    const nonNullArticleMetaData = articleMetaData
        .filter(metadata => metadata !== null)
        .filter(metadata => metadata.show);

    if (nonNullArticleMetaData.length !== articleMetaData.length) {
        console.warn(`A missing article failed to have its metadata fetched, which is one of ${JSON.stringify(missingArticles)}`)
    }

    return nonNullArticleMetaData;
}

async function sendNewArticleEmail() {
    const {ArticleList} = await getDb();

    const result = await ArticleList.get({id: ARTICLE_LIST_ID}).go();

    let articles: string[] = []
    if (result.data) {
        articles = result.data.articles;
    }

    const existingArticles = await getAllArticleParams();
    const missingArticles = existingArticles.filter(article => !articles.includes(article));

    if (missingArticles.length === 0) {
        console.log("No new articles have been published. Skipping sending emails.")
        return;
    }

    const emails = await getAllEmails();
    const articleMetaData = await getMissingArticleMetaData(missingArticles);

    if (emails.length === 0) {
        console.log("No users with confirmed emails to send emails to.")
        return;
    }

    await ArticleList.put({id: ARTICLE_LIST_ID, articles: [...existingArticles, ...missingArticles]}).go()

    for (let emailRecord of emails) {
        if (!emailRecord.email) {
            continue
        }
        const unsubscribeLink = await createUnsubscribeLink(emailRecord.email, emailRecord.id)
        await sendEmail({
            to: emailRecord.email,
            subject: "Dominic's Blog - New Article Posted",
            textBody: "Dominic has posted an article!",
            htmlBody: createNewArticleEmailTemplate(articleMetaData, unsubscribeLink)
        })
        console.log(`Email sent to: ${emailRecord.email}`)
    }
}


