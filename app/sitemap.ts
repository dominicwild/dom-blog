import type {MetadataRoute} from "next";
import {getArticleCardData} from "@/articles/getArticles";
import {absoluteUrl} from "@/app/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const articles = await getArticleCardData();
    const visibleArticles = articles.filter(article => article.show);
    const latestArticleDate = visibleArticles[0]?.date ?? new Date();

    return [
        {
            url: absoluteUrl("/"),
            lastModified: latestArticleDate,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: absoluteUrl("/blogs"),
            lastModified: latestArticleDate,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...visibleArticles.map(article => ({
            url: absoluteUrl(`/blogs/${article.folder}`),
            lastModified: article.date,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
    ];
}
