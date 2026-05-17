import type {MetadataRoute} from "next";
import {absoluteUrl} from "@/app/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/confirm", "/unsubscribe"],
        },
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
