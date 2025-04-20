"use server"
import * as fs from "node:fs";
import path from "node:path";


import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import strip from 'strip-markdown';

export type ArticleMetaData = {
    title: string,
    description: string,
    icon?: string,
    tags: string[],
    image?: string,
    date: Date,
    show?: Boolean
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

async function getReadingTimeEstimation(markdown: string) {
    const text = await unified()
        .use(remarkParse)
        .use(strip, {keep: ['text']}) // removes formatting, tables, HTML
        .use(remarkStringify)
        .process(markdown)

    const allWords = String(text).split(" ").map(word => word.trim());
    const filteredWords = allWords.filter(word =>
        word.length > 0
        && !word.match(/[^\w\s]/)
        && word.length < 20
    );
    const charCountOfWords = filteredWords.reduce((acc, word) => acc + word.length, 0);
    const charsPerMinute = 250
    return Math.round(charCountOfWords / charsPerMinute);
}

export async function getArticleCardData() {
    const articleDirs = fetchArticleDirectories();

    const articleMetadata = await Promise.all(
        articleDirs.map((folderName) => getArticleMetaData(folderName))
    )

    const cardData = articleMetadata
        .filter(articleMetadata => articleMetadata !== null)
        .map(async articleMetadata => {
            const timeToReadMinutes = await getReadingTimeEstimation(articleMetadata.content);

            return {
                ...articleMetadata,
                timeToReadMinutes
            }
        })

    const cardDatas = await Promise.all(cardData);
    return cardDatas
}

async function getMetadataForArticle(dir: string) {
    return (await import(`../${articlesDirectory}/${dir}/metadata`)).default as ArticleMetaData;
}

export type RecentArticles = ReturnType<typeof getRecentArticlesMetadata>
export type RecentArticle = Awaited<ReturnType<typeof getRecentArticlesMetadata>>[number]

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
    return articleMetadata.filter(metadata => metadata.show).splice(0, 3);
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
        content: markdownContent,
        folder: folderName,
    }
}