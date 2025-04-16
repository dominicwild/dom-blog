import React from "react";
import ParticleCanvas from "@/app/_components/ParticleCanvas";
import {ArrowDown} from "lucide-react";


function Hero() {
    return (

        <section id="hero" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            <ParticleCanvas/>

            <div className="mx-auto z-10">
                <div className="max-w-2xl backdrop-blur-sm bg-slate-900/30 p-8 rounded-lg border border-blue-500/10">
                    <h1 className="text-5xl p-2 md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
                        Dominic's Blog
                    </h1>
                </div>
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