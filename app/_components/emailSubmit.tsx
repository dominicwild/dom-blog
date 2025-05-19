"use client"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState, useRef, useEffect} from "react";
import {submitEmail} from "@/server/dynamo";
import {motion, AnimatePresence} from "framer-motion";
import {Send, CheckCircle, AlertCircle, Loader2} from "lucide-react";

export function EmailSubmit() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Reset state after some time when submitted successfully
    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                setSubmitted(false);
                setEmail("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [submitted]);

    // Reset error after some time
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || submitting) return;

        setSubmitting(true);
        setError("");

        try {
            const result = await submitEmail(email);
            console.log(result);
            if (result?.success) {
                setSubmitted(true);
            } else {
                if (result && result.error) {
                    setError((result.error as unknown as Error).message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        } catch (e) {
            setError((e as unknown as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    const sendDisabled = submitting || submitted || !email
    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <form
                    ref={formRef}
                    className="relative flex flex-col space-y-2"
                    onSubmit={handleSubmit}
                >
                    <div className="relative flex items-center">
                        <motion.div
                            className="relative flex-1 group"
                            animate={focused ? {scale: 1.02} : {scale: 1}}
                            transition={{type: "spring", stiffness: 400, damping: 25}}
                        >
                            <Input
                                ref={inputRef}
                                type="email"
                                name="email"
                                placeholder="Your email address"
                                className={`pr-10 border-2 transition-all duration-300 ${focused
                                    ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                    : "border-gray-700 hover:border-gray-500"
                                } ${error ? "border-red-500" : ""} ${submitted ? "border-green-500" : ""}`}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                disabled={submitting || submitted}
                                required
                            />
                            <AnimatePresence mode="wait">
                                {submitted && (
                                    <motion.div
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                                        initial={{opacity: 0, scale: 0}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0}}
                                        transition={{type: "spring", stiffness: 500, damping: 25}}
                                    >
                                        <CheckCircle size={18}/>
                                    </motion.div>
                                )}
                                {error && (
                                    <motion.div
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                                        initial={{opacity: 0, scale: 0}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0}}
                                        transition={{type: "spring", stiffness: 500, damping: 25}}
                                    >
                                        <AlertCircle size={18}/>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            className={`ml-3 ${sendDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                            whileHover={{scale: !sendDisabled ? 1.05 : 1}}
                            whileTap={{scale: !sendDisabled ? 0.95 : 1}}
                        >
                            <Button
                                className="relative overflow-hidden group cursor-pointer"
                                variant={submitted ? "default" : "secondary"}
                                type="submit"
                                disabled={sendDisabled}
                            >
                                <AnimatePresence mode="wait">
                                    {submitting ? (
                                        <motion.div
                                            key="loading"
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            className="flex items-center"
                                        >
                                            <Loader2 className="mr-1 h-4 w-4 animate-spin"/>
                                            <span>Sending</span>
                                        </motion.div>
                                    ) : submitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            className="flex items-center"
                                        >
                                            <CheckCircle className="mr-1 h-4 w-4"/>
                                            <span>Sent</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="submit"
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            className="flex items-center"
                                        >
                                            <Send
                                                className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform"/>
                                            <span>Subscribe</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Button background animation */}
                                {!submitted && !submitting && (
                                    <motion.div
                                        className="absolute inset-0 bg-blue-500 z-0"
                                        initial={{x: "-100%"}}
                                        whileHover={{x: 0}}
                                        transition={{duration: 0.3, ease: "easeInOut"}}
                                    />
                                )}
                            </Button>
                        </motion.div>
                    </div>

                    {/* Status messages */}
                    <div className="h-6 relative">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    className="absolute inset-0 text-red-500 text-sm flex items-center"
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.2}}
                                >
                                    <AlertCircle className="mr-1 h-4 w-4"/>
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            {submitted && !error && (
                                <motion.div
                                    key="success"
                                    className="absolute inset-0 text-green-500 text-sm flex items-center"
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.2}}
                                >
                                    <CheckCircle className="mr-1 h-4 w-4"/>
                                    <span>Thank you! Confirmation email sent.</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}