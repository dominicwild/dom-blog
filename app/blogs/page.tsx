import React from 'react';
import BlogRootPageContent from "@/app/blogs/_components/PageContent";
import {getArticleCardData} from "@/articles/getArticles";
import type {Metadata} from "next";
import {absoluteUrl, siteDescription, siteName} from "@/app/seo";

export const metadata: Metadata = {
    title: "Articles",
    description: siteDescription,
    alternates: {
        canonical: "/blogs",
    },
    openGraph: {
        type: "website",
        url: absoluteUrl("/blogs"),
        siteName,
        title: `Articles | ${siteName}`,
        description: siteDescription,
    },
    twitter: {
        card: "summary_large_image",
        title: `Articles | ${siteName}`,
        description: siteDescription,
    },
};

const Page = async () => {
    const blogs = await getArticleCardData()
    return (
        <div>
            <BlogRootPageContent blogs={blogs}/>
        </div>
    );
};

export default Page;
