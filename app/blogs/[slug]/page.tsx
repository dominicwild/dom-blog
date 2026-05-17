import React, {Suspense} from 'react';
import {getArticleCardData, getArticleMetaData} from "@/articles/getArticles";
import {Calendar, Tag} from "lucide-react";
import Markdown from "@/app/_components/Markdown";
import {Badge} from "@/components/ui/badge";
import {Spinner} from "@/components/ui/spinner";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {absoluteUrl, siteAuthor, siteImage, siteName} from "@/app/seo";


export async function generateMetadata({params}: { params: Promise<Record<string, string>> }) {
    const slug = (await params).slug
    const articleMetadata = await getArticleMetaData(slug);

    if (!articleMetadata || !articleMetadata.show) {
        return {
            robots: {
                index: false,
                follow: false,
            },
        } as Metadata;
    }

    const articleUrl = absoluteUrl(`/blogs/${slug}`);
    const imageUrl = absoluteUrl(articleMetadata.image ?? siteImage);

    return {
        title: articleMetadata.title,
        description: articleMetadata.description,
        authors: [siteAuthor],
        alternates: {
            canonical: `/blogs/${slug}`,
        },
        openGraph: {
            type: "article",
            url: articleUrl,
            siteName,
            title: articleMetadata.title,
            description: articleMetadata.description,
            publishedTime: articleMetadata.date.toISOString(),
            authors: [siteAuthor.name],
            tags: articleMetadata.tags,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: articleMetadata.title,
                },
            ],
        },
        twitter: {
            title: articleMetadata.title,
            description: articleMetadata.description,
            images: [imageUrl],
            card: "summary_large_image",
        },
    } as Metadata;
}

export async function generateStaticParams() {
    const blogs = await getArticleCardData();

    return blogs.filter(article => article.show).map(article => ({
        slug: article.folder,
    }))
}

async function Article({slug}: { slug: string }) {
    const articleMetadata = await getArticleMetaData(slug);

    if (!articleMetadata || !articleMetadata.show) {
        notFound();
    }

    const articleUrl = absoluteUrl(`/blogs/${slug}`);
    const imageUrl = absoluteUrl(articleMetadata.image ?? siteImage);
    const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: articleMetadata.title,
        description: articleMetadata.description,
        image: [imageUrl],
        datePublished: articleMetadata.date.toISOString(),
        author: {
            "@type": "Person",
            name: siteAuthor.name,
            url: siteAuthor.url,
        },
        publisher: {
            "@type": "Person",
            name: siteAuthor.name,
            url: siteAuthor.url,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
        },
        keywords: articleMetadata.tags.join(", "),
    };

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className={"container text-white"}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(blogPostingSchema)}}
            />
            <div className="relative">
                <div className="mx-auto px-46 pt-12 pb-8 relative">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">{articleMetadata.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4"/>
                            <span>{dateFormatter.format(articleMetadata.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4"/>
                            <div className="flex gap-2">
                                {articleMetadata.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        className="px-2 py-1 rounded text-slate-400"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"w-full flex justify-center items-center flex-col"}>
                <div className={"max-w-prose flex flex-col gap-y-6 text-xl mb-8"}>
                    <Markdown>
                        {articleMetadata.content}
                    </Markdown>
                </div>
            </div>
        </div>
    );
}

export default async function Page({params}: { params: Promise<Record<string, string>> }) {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen w-full">
                <Spinner size="xl" variant="primary"/>
            </div>
        }>
            <Article slug={(await params).slug}/>
        </Suspense>
    );
}
