import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import "./globals.css";
import {Analytics} from "@vercel/analytics/next";
import React, {ReactNode} from "react";
import {EmailSubmit} from "./_components/EmailSubmit";
import {absoluteUrl, siteDescription, siteImage, siteName, siteUrl} from "@/app/seo";


export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: siteName,
        template: `%s | ${siteName}`,
    },
    description: siteDescription,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: siteUrl,
        siteName,
        title: siteName,
        description: siteDescription,
        images: [
            {
                url: absoluteUrl(siteImage),
                width: 1200,
                height: 630,
                alt: siteName,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteName,
        description: siteDescription,
        images: [absoluteUrl(siteImage)],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '700'],
    variable: '--font-montserrat',
    display: 'swap',
})

export default function RootLayout({children,}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">

        <Analytics/>
        <body
            className={`${montserrat.className} antialiased !bg-[#1A2333]`}
        >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>
        <div className={"min-h-screen"}>
            {children}
        </div>
        <div className={"min-h-[10vh] py-4 bg-[#1a1e2d] flex justify-center items-center text-white flex-col"}>
            <div>
                Wanted to get updated when I post a new blog?
                <EmailSubmit/>
            </div>
        </div>
        </body>

        </html>
    );
}
