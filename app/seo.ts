export const siteUrl = "https://blog.dominicwild.com";
export const siteName = "Dominic's Blog";
export const siteDescription = "Articles from Dominic Wild on software development, AI workflows, and technology.";
export const siteImage = "/blog-logo.png";

export const siteAuthor = {
    name: "Dominic Wild",
    url: "https://dominicwild.com",
};

export function absoluteUrl(pathOrUrl: string) {
    return new URL(pathOrUrl, siteUrl).toString();
}
