import React from "react";
import ParticleCanvas from "@/app/_components/ParticleCanvas";
import TypeWriter from "@/app/_components/TypeWriter";
import {ArrowDown, TerminalIcon} from "lucide-react";
import {Card, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {getRecentArticlesMetadata} from "@/articles/getArticles";

const Articles = async () => {
    const dateFormat = Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
    })

    const recentArticles = await getRecentArticlesMetadata();

    return (
        <>
            {
                recentArticles.map((article, i) =>
                    <Card
                        className={`${i == 0 ? "h-48" : "h-40"} gap-y-0 w-[33%] bg-primary cursor-pointer group border-[#2b3686] hover:border-[#4756b8] border-2 p-4 transition-all duration-200 ease-in-out text-white`}
                        key={article.title}
                    >
                        <CardTitle
                            className={" h-9 text-2xl group-hover:text-[#5EA1FF] transition-all duration-200 ease-in-out flex"}>
                            <TerminalIcon color={"#4a63ff"} size={32} className={"mr-2 h-8 w-[10%]"}/>
                            <div className={"line-clamp-1 w-[85%]"}>
                                {article.title}
                            </div>
                        </CardTitle>
                        <h2 className={`px-2 font-extralight ${i == 0 ? "line-clamp-3" : "line-clamp-2"}`}>
                            {article.description}
                        </h2>
                        <div className={"flex-1"}/>
                        <div className={"px-2 flex justify-between"}>
                            <div className={"flex gap-x-2 items-center"}>
                                {article.tags?.splice(0, 3).map(tag => (
                                    <Badge variant={"secondary"} className={"!bg-muted"} key={tag}>
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <div>
                                <Badge className={"text-muted text-md"}>
                                    {dateFormat.format(article.date)}
                                </Badge>
                            </div>
                        </div>
                    </Card>
                )
            }
        </>
    );
};


function Hero() {
    return (
        <section id="hero" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            <ParticleCanvas/>

            <div className="mx-auto z-10 w-[50%] flex items-center justify-center flex-col">
                <div
                    className="max-w-2xl backdrop-blur-sm bg-slate-900/30 p-8 rounded-lg border border-blue-500/10 transition-all duration-300 ease-in-out">
                    <h1 className="mb-2 text-5xl p-2 md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
                        <TypeWriter delay={50}>
                            Dominic's Blog
                        </TypeWriter>
                    </h1>
                    <h2 className={"px-2 text-white"}>
                        <TypeWriter delay={10} hideEndCursor>
                            Welcome to my blog! This is where I write about my various opinions, thoughts and
                            experiences on
                            technology. Find my articles below!
                        </TypeWriter>
                    </h2>
                </div>
                {/*<div className={"z-10 text-white w-full mt-4"}>*/}
                {/*    <Input*/}
                {/*        className={"!text-3xl selection:bg-blue-500  h-auto bg-primary border-gray-700 focus-visible:border-blue-500 focus-visible:ring-blue-400/50 w-full"}/>*/}
                {/*</div>*/}
            </div>

            <div className={"flex gap-x-2 z-10 mt-8 items-start mx-[20%] justify-between"}>
                <Articles/>
            </div>


            <div className="absolute bottom-8 animate-bounce">
                <ArrowDown className="h-8 w-8 text-blue-400"/>
            </div>
        </section>

    );
}

export default function Home() {

    return (
        <div>
            <Hero/>
        </div>
    );
}