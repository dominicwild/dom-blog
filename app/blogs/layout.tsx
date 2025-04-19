import {ReactNode} from "react";
import Link from "next/link";
import Image from "next/image";
import {UnderlineLink} from "@/app/_components/UnderlineLink";
import {ArrowLeft} from "lucide-react";


export default function RootLayout({children,}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <div>
            <nav
                className="sticky top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[#0A0F1C]/50 border-b border-slate-800">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className={"p-3"}>
                        <Image src={"/blog-logo-cropped.png"} alt={"Blog Logo"} height={64} width={64}/>
                    </Link>
                    <div className="flex items-center justify-center gap-6">
                        <UnderlineLink href="/blogs"
                                       className="text-slate-400 hover:text-white transition-colors py-1"
                        >
                            <div className={"flex items-center"}>
                                <ArrowLeft className={"mr-2"}/>
                                Back to Blogs
                            </div>
                        </UnderlineLink>
                    </div>
                </div>
            </nav>
            <div className={"container mx-auto min-h-[90vh]"}>
                {children}
            </div>
        </div>
    );
}
