import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import "./globals.css";
import {Analytics} from "@vercel/analytics/next";
import React, {ReactNode} from "react";
import {EmailSubmit} from "@/app/_components/emailSubmit";


export const metadata: Metadata = {
    title: "Dominic Blog",
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
