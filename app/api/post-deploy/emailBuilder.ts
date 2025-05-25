import {ArticleMetaData} from "@/articles/getArticles";

export function createNewArticleEmailTemplate(articles: (ArticleMetaData & { folder: string })[],
                                              unsubscribeUrl: string
) {
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    const articleCount = articles.length;
    const pluralText = articleCount === 1 ? 'article' : 'articles';

    const articleCards = articles.map(article => {
        const articleUrl = `${baseUrl}/blogs/${article.folder}`;
        let imageUrl = article.image ? `${article.image}` : '';
        if (imageUrl.charAt(0) === '/') {
            imageUrl = `https://${baseUrl}${imageUrl}`;
        }

        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div style="background: #ffffff; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
                ${imageUrl ? `
                    <div style="margin-bottom: 16px;">
                        <img src="${imageUrl}" alt="${article.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                    </div>
                ` : ''}
                
                <h2 style="color: #1f2937; font-size: 24px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.3;">
                    <a href="${articleUrl}" style="color: #1f2937; text-decoration: none;">${article.title}</a>
                </h2>
                
                <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                    ${article.description}
                </p>
                
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
                    <div style="color: #9ca3af; font-size: 14px;">
                        ${formattedDate}
                    </div>
                    
                    ${article.tags && article.tags.length > 0 ? `
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${article.tags.map(tag => `
                                <span style="margin-left: 2px;background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500;">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <a href="${articleUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background-color 0.2s;">
                    Read Article →
                </a>
            </div>
        `;
    }).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New ${pluralText} from Dominic's Blog</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background: #f9fafb;">
                <!-- Header -->
                <div style="padding: 40px 24px; text-align: center;">
                    <h1 style="color: black; font-size: 32px; font-weight: 800; margin: 0 0 8px 0;">
                        📝 New ${pluralText.charAt(0).toUpperCase() + pluralText.slice(1)} Published!
                    </h1>
                    <p style="color: black; font-size: 18px; margin: 0;">
                        ${articleCount === 1 ? 'I just published a new article' : `I just published ${articleCount} new articles`} on my blog
                    </p>
                </div>
                
                <!-- Content -->
                <div style="padding: 32px 24px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                        Hi there! 👋
                    </p>
                    
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                        I'm excited to share ${articleCount === 1 ? 'my latest article' : 'my latest articles'} with you. 
                        ${articleCount === 1 ? 'Here\'s what I\'ve been working on:' : 'Here\'s what I\'ve been working on:'}
                    </p>
                    
                    <!-- Article Cards -->
                    ${articleCards}
                    
                    <!-- Call to Action -->
                    <div style="background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; margin-top: 32px;">
                        <p style="color: #374151; font-size: 16px; margin: 0 0 16px 0;">
                            Want to see all my articles?
                        </p>
                        <a href="${baseUrl}" style="display: inline-block; background: #1f2937; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                            Visit My Blog
                        </a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f3f4f6; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                        Thanks for subscribing to my blog updates!
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        Best regards,<br>Dominic
                    </p>
                    <div style="margin-top: 16px;">
                        <a href="${unsubscribeUrl}" style="color: #9ca3af; font-size: 12px; text-decoration: underline;">
                            Unsubscribe from these emails
                        </a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}