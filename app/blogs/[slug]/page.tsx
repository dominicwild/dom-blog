import React from 'react';
import {getArticleMetaData} from "@/articles/getArticles";
import NotFound from "@/app/not-found";

const Page = async ({params}: { params: Promise<Record<string, string>> }) => {
    const articleMetadata = await getArticleMetaData("abc")

    if (!articleMetadata) {
        return <NotFound/>
    }

    return (
        <div className={"container text-white"}>
            {JSON.stringify(await params)}
        </div>
    );
};

export default Page;