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

function fetchArticleDirectories() {
    const fileNames = fs.readdirSync(articlesDirectory)
    const articleDirs: string[] = []

    for (let fileName of fileNames) {
        const fileToCheck = path.join(articlesDirectory, fileName);
        const fileInfo = fs.statSync(fileToCheck)
        if (fileInfo.isDirectory()) {
            articleDirs.push(fileName)
        }
    }
    return articleDirs;
}

export async function getAllArticleParams() {
    return fetchArticleDirectories();
}

async function getMetadataForArticle(dir: string) {
    return (await import(`../${articlesDirectory}/${dir}/metadata`)).default as ArticleMetaData;
}

export async function getRecentArticlesMetadata() {
    const articleDirs = fetchArticleDirectories();

    const articleMetadataPromises = articleDirs.map(async dir => {
        // Must be relative imports, absolute are not supported
        const metadata = await getMetadataForArticle(dir);
        return {
            ...metadata,
            folder: dir
        }
    })

    const articleMetadata = await Promise.all(articleMetadataPromises);
    return articleMetadata.splice(0, 3);
}

export async function getArticleMetaData(folderName: string) {
    const articleFolderFilePath = path.join(articlesDirectory, folderName);
    if (!fs.existsSync(articleFolderFilePath)) {
        return null;
    }

    const stat = fs.statSync(articleFolderFilePath)
    if (!stat.isDirectory()) {
        return null;
    }

    const metadata = await getMetadataForArticle(folderName);

    const markdownFilePath = path.join(articlesDirectory, folderName, "article.md");
    const markdownContent = fs.readFileSync(markdownFilePath, "utf8");
    return {
        ...metadata,
        content: markdownContent
    }
}