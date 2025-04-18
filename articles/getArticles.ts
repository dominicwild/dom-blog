"use server"
import * as fs from "node:fs";
import path from "node:path";

export type ArticleMetaData = {
    title: string,
    description: string,
    icon?: string,
    tags: string[],
    date: Date,
}

const articlesDirectory = "articles";

export async function getRecentArticlesMetadata() {
    const fileNames = fs.readdirSync(articlesDirectory)
    const articleDirs: string[] = []

    for (let fileName of fileNames) {
        const fileToCheck = path.join(articlesDirectory, fileName);
        const fileInfo = fs.statSync(fileToCheck)
        if (fileInfo.isDirectory()) {
            articleDirs.push(fileName)
        }
    }

    const articleMetadataPromises = articleDirs.map(async dir => {
        // Must be relative imports, absolute are not supported
        const metadata = await import(`../${articlesDirectory}/${dir}/metadata`);
        return {
            ...metadata.default as ArticleMetaData,
            folder: dir
        }
    })

    const articleMetadata = await Promise.all(articleMetadataPromises);
    return articleMetadata.splice(0, 3);
}