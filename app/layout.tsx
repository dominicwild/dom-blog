import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import "./globals.css";
import {Analytics} from "@vercel/analytics/next";


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
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">

        <Analytics/>
        <body
            className={`${montserrat.className} antialiased`}
        >
        {children}
        </body>

        </html>
    );
}
