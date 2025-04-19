import React, {Suspense, use} from 'react';
import {getAllArticleParams, getArticleMetaData} from "@/articles/getArticles";
import NotFound from "@/app/not-found";
import {Calendar, Tag} from "lucide-react";
import Markdown from "@/app/_components/Markdown";
import {Badge} from "@/components/ui/badge";
import {Spinner} from "@/components/ui/spinner";


export async function generateStaticParams() {
    const blogs = await getAllArticleParams();

    return blogs.map(folderName => ({
        slug: folderName,
    }))
}

async function Article({slug}: { slug: string }) {
    const articleMetadata = await getArticleMetaData(slug);

    if (!articleMetadata) {
        return <NotFound/>;
    }

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className={"container text-white"}>
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
