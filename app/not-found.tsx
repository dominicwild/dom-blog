"use client"

import Link from "next/link"
import {useEffect, useState} from "react"
import {ArrowLeft, Search, Home} from "lucide-react"
import {motion} from "framer-motion"
import {Button} from "@/components/ui/button";

export default function NotFound() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <main className="flex-grow flex flex-col items-center justify-center px-4 text-center h-full mt-8 min-h-screen">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="max-w-2xl mx-auto"
            >
                <motion.div
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{delay: 0.2, duration: 0.5}}
                    className="mb-8 text-gray-500 text-9xl font-bold"
                >
                    404
                </motion.div>

                <motion.h1
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.4, duration: 0.5}}
                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                >
                    Article not found
                </motion.h1>

                <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.6, duration: 0.5}}
                    className="text-gray-400 mb-8 text-lg"
                >
                    The page you're looking for doesn't exist or has been moved.
                </motion.p>

                <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.8, duration: 0.5}}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button asChild
                            className="flex items-center !p-6 justify-center gap-2  text-white px-6 py-3 rounded-md transition-all hover:scale-105 hover:border-white hover:border-1 border-1 border-primary"
                    >
                        <Link href="/">
                            <Home size={18}/>
                            Return to home
                        </Link>
                    </Button>

                    <Button asChild
                            className="flex items-center !p-6 justify-center gap-2 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-md transition-all hover:scale-105"
                    >
                        <Link href="/blog">
                            <ArrowLeft size={18}/>
                            Back to blog
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>

            {/* Animated dots */}
            <div className="mt-16 relative">
                <motion.div
                    className="absolute w-2 h-2 rounded-full bg-blue-500"
                    animate={{
                        x: [0, 20, 0, -20, 0],
                        y: [0, -20, 0, -20, 0],
                        opacity: [0.2, 0.8, 0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute w-2 h-2 rounded-full bg-purple-500 ml-10"
                    animate={{
                        x: [0, -20, 0, 20, 0],
                        y: [0, 20, 0, 20, 0],
                        opacity: [0.2, 0.8, 0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                />
                <motion.div
                    className="absolute w-2 h-2 rounded-full bg-green-500 ml-20"
                    animate={{
                        x: [0, 20, 0, -20, 0],
                        y: [0, 20, 0, -20, 0],
                        opacity: [0.2, 0.8, 0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>

            {/* Search suggestion */}
            {/*<motion.div*/}
            {/*    initial={{opacity: 0}}*/}
            {/*    animate={{opacity: 1}}*/}
            {/*    transition={{delay: 1.2, duration: 0.5}}*/}
            {/*    className="mt-24 bg-gray-900 p-6 rounded-lg max-w-md w-full"*/}
            {/*>*/}
            {/*    <h3 className="text-white text-lg mb-4">Looking for something?</h3>*/}
            {/*    <div className="relative">*/}
            {/*        <input*/}
            {/*            type="text"*/}
            {/*            placeholder="Search articles..."*/}
            {/*            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"*/}
            {/*        />*/}
            {/*        <Search className="absolute left-3 top-2.5 text-gray-500" size={18}/>*/}
            {/*    </div>*/}
            {/*</motion.div>*/}
        </main>
    )
}
