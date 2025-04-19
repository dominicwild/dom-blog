import React from 'react';
import BlogRootPageContent from "@/app/blogs/_components/PageContent";
import {getArticleCardData} from "@/articles/getArticles";


const Page = async () => {
    const blogs = await getArticleCardData()
    return (
        <div>
            <BlogRootPageContent blogs={blogs}/>
        </div>
    );
};

export default Page;