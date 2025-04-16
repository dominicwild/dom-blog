import React from "react";
import ParticleCanvas from "@/app/_components/ParticleCanvas";
import TypeWriter from "@/app/_components/TypeWriter";
import {ArrowDown} from "lucide-react";
import {Input} from "@/components/ui/input";


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