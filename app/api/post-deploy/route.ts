import {createHmac} from "node:crypto";
import {createUnsubscribeLink, getDb} from "@/server/dynamo";
import {getAllArticleParams, getArticleMetaData} from "@/articles/getArticles";
import {sendEmail} from "@/server/email";
import {createNewArticleEmailTemplate} from "@/app/api/post-deploy/emailBuilder";

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    await sendNewArticleEmail();

    return new Response('Request validated', {
        status: 200,
    });
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

    const nullMetadata = articleMetaData.filter(metadata => metadata === null)

    if (nullMetadata.length > 0) {
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


