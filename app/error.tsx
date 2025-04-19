"use client"

import Link from "next/link"
import {useState} from "react"
import {motion} from "framer-motion"
import {AlertTriangle, RefreshCw, Home, Mail} from "lucide-react"
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";

type ErrorPageProps = {
    statusCode?: number
    title?: string
    message?: string
    showRefresh?: boolean
    showContact?: boolean
}

function StrobeLights() {
    return <div className="mt-16 relative h-20 w-full max-w-md">
        <motion.div
            className="absolute left-1/4 w-1 h-20 bg-gradient-to-t from-transparent via-red-500 to-transparent opacity-20"
            animate={{
                height: [20, 50, 20],
                y: [0, -10, 0],
            }}
            transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
            }}
        />
        <motion.div
            className="absolute left-1/3 w-1 h-20 bg-gradient-to-t from-transparent via-red-500 to-transparent opacity-30"
            animate={{
                height: [30, 60, 30],
                y: [0, -15, 0],
            }}
            transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: 0.2,
            }}
        />
        <motion.div
            className="absolute left-1/2 w-1 h-20 bg-gradient-to-t from-transparent via-blue-500 to-transparent opacity-40"
            animate={{
                height: [40, 70, 40],
                y: [0, -20, 0],
            }}
            transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: 0.4,
            }}
        />
        <motion.div
            className="absolute left-2/3 w-1 h-20 bg-gradient-to-t from-transparent via-blue-500 to-transparent opacity-30"
            animate={{
                height: [35, 65, 35],
                y: [0, -15, 0],
            }}
            transition={{
                duration: 2.7,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: 0.6,
            }}
        />
        <motion.div
            className="absolute left-3/4 w-1 h-20 bg-gradient-to-t from-transparent via-blue-500 to-transparent opacity-20"
            animate={{
                height: [25, 55, 25],
                y: [0, -10, 0],
            }}
            transition={{
                duration: 2.3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: 0.8,
            }}
        />
    </div>;
}

export default function ErrorPage({
                                      statusCode = 500,
                                      title = "Something went wrong",
                                      message = "We encountered an unexpected error while processing your request.",
                                      showRefresh = true,
                                      showContact = true,
                                  }: ErrorPageProps) {
    const [isRetrying, setIsRetrying] = useState(false)

    const handleRetry = () => {
        setIsRetrying(true)
        // Retry with some delay
        setTimeout(() => {
            window.location.reload()
        }, 1500)
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0d14]">
            <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="max-w-2xl mx-auto"
                >
                    <motion.div
                        initial={{scale: 0.8, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{delay: 0.2, duration: 0.5}}
                        className="mb-10 flex justify-center"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{
                                    rotate: [0, 5, 0, -5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "loop",
                                }}
                            >
                                <AlertTriangle size={80} className="text-red-500"/>
                            </motion.div>
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20"
                                initial={{scale: 0.8, opacity: 0}}
                                animate={{
                                    scale: [1.5, 1.7, 1.5],
                                    translateY: [4],
                                    opacity: [0.2, 0.1, 0.2],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "loop",
                                }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className="mb-6 text-gray-500 text-6xl font-bold"
                    >
                        {statusCode}
                    </motion.div>

                    <motion.h1
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.4, duration: 0.5}}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.6, duration: 0.5}}
                        className="text-gray-400 mb-8 text-lg"
                    >
                        {message}
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

                        {showRefresh && (
                            <button
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="flex items-center justify-center gap-2 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-md transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:border-gray-700 disabled:hover:text-gray-300"
                            >
                                {isRetrying ? (
                                    <>
                                        <Spinner size="sm" className="mr-2"/>
                                        Retrying...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={18}/>
                                        Try again
                                    </>
                                )}
                            </button>
                        )}
                    </motion.div>

                    {showContact && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 1, duration: 0.5}}
                            className="mt-12 text-gray-400"
                        >
                            <p className="mb-2">If the problem persists, please contact me.</p>
                            <Link
                                href="mailto:blog-support@dominicwild.com"
                                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <Mail size={16} className="mr-2"/>
                                Contact Me
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                <StrobeLights/>
            </main>
        </div>
    )
}
