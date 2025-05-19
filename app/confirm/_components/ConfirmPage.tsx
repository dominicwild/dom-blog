"use client"
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {confirmEmailSubscription} from "@/server/dynamo";
import {AnimatePresence, motion} from "framer-motion";
import {CheckCircle, Loader2, XCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export function ConfirmPage() {
    const searchParams = useSearchParams();
    const [state, setState] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    useEffect(() => {
        const processConfirmation = async () => {
            try {

                if (!email || !id) {
                    setState("error")
                    setErrorMessage("The URL is malformed.");
                    return;
                }

                console.log("email", email);
                console.log("id", id);

                const isVerified = await confirmEmailSubscription(id, email);
                if (!isVerified) {
                    setState("error")
                    setErrorMessage("Your email could not be verified.");
                }
                setState("success");
            } catch (error) {
                setState("error");
                setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
            }
        };

        processConfirmation();
    }, [searchParams]);

    return (
        <div className="flex flex-col min-h-screen bg-[#1A2333]">
            <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
                <AnimatePresence mode="wait">
                    {state === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.5}}
                            className="max-w-md mx-auto"
                        >
                            <motion.div
                                className="mb-8 flex justify-center"
                                animate={{
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear"
                                }}
                            >
                                <Loader2 size={80} className="text-blue-500"/>
                            </motion.div>

                            <motion.h1
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                animate={{opacity: [0.7, 1, 0.7]}}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "loop"
                                }}
                            >
                                Confirming your subscription
                            </motion.h1>

                            <motion.p
                                className="text-gray-400 mb-8"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.3, duration: 0.5}}
                            >
                                Please wait while we verify your email address...
                            </motion.p>

                            <div className="mt-8">
                                <motion.div
                                    className="flex space-x-2 justify-center"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.5, duration: 0.5}}
                                >
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="h-2 w-2 rounded-full bg-blue-500"
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.5, 1, 0.5]
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "loop",
                                                delay: i * 0.2
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {state === "success" && (
                        <motion.div
                            key="success"
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 1.1}}
                            transition={{duration: 0.5}}
                            className="max-w-md mx-auto"
                        >
                            <motion.div
                                className="mb-8 flex justify-center"
                                initial={{scale: 0, rotate: -180}}
                                animate={{scale: 1, rotate: 0}}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                            >
                                <div className="relative">
                                    <CheckCircle size={80} className="text-green-500"/>
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-4 border-green-500 opacity-20"
                                        initial={{scale: 0.8, opacity: 0}}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.2, 0.5, 0.2],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                            repeatType: "loop",
                                        }}
                                    />
                                </div>
                            </motion.div>

                            <motion.h1
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.2, duration: 0.5}}
                            >
                                Subscription Confirmed!
                            </motion.h1>

                            <motion.p
                                className="text-gray-400 mb-8"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.4, duration: 0.5}}
                            >
                                Thank you for subscribing to blog updates. You'll now receive notifications when new
                                articles are posted.
                            </motion.p>

                            <motion.div
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.6, duration: 0.5}}
                            >
                                <Button asChild
                                        className="flex items-center justify-center gap-2 text-white px-6 py-3 rounded-md transition-all hover:scale-105"
                                >
                                    <Link href="/">
                                        Return to home
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}

                    {state === "error" && (
                        <motion.div
                            key="error"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.5}}
                            className="max-w-md mx-auto"
                        >
                            <motion.div
                                className="mb-8 flex justify-center"
                                initial={{scale: 0.8, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                transition={{delay: 0.2, duration: 0.5}}
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
                                        <XCircle size={80} className="text-red-500"/>
                                    </motion.div>
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-4 border-red-500 opacity-20"
                                        initial={{scale: 0.8, opacity: 0}}
                                        animate={{
                                            scale: [1.5, 1.7, 1.5],
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

                            <motion.h1
                                className="text-3xl md:text-4xl font-bold text-white mb-4"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.3, duration: 0.5}}
                            >
                                Confirmation Failed
                            </motion.h1>

                            <motion.p
                                className="text-gray-400 mb-8"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: 0.4, duration: 0.5}}
                            >
                                {errorMessage || "We couldn't confirm your subscription. Please try again or contact support."}
                            </motion.p>

                            <motion.div
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.6, duration: 0.5}}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <Button asChild
                                        className="flex items-center justify-center gap-2 text-white px-6 py-3 rounded-md transition-all hover:scale-105"
                                >
                                    <Link href="/">
                                        Return to home
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="flex items-center justify-center gap-2 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-md transition-all hover:scale-105"
                                >
                                    Try again
                                </Button>
                            </motion.div>

                            {/* Strobe effect */}
                            <div className="mt-16 relative h-20 w-full max-w-md">
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
                                    className="absolute left-1/2 w-1 h-20 bg-gradient-to-t from-transparent via-red-500 to-transparent opacity-30"
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
                                    className="absolute left-3/4 w-1 h-20 bg-gradient-to-t from-transparent via-red-500 to-transparent opacity-20"
                                    animate={{
                                        height: [25, 45, 25],
                                        y: [0, -12, 0],
                                    }}
                                    transition={{
                                        duration: 2.3,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "loop",
                                        delay: 0.4,
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}