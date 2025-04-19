"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

type SpinnerProps = {
    size?: "sm" | "md" | "lg" | "xl"
    variant?: "primary" | "secondary" | "subtle"
    className?: string
}

export function Spinner({ size = "md", variant = "primary", className }: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
    }

    const variantClasses = {
        primary: "text-blue-500",
        secondary: "text-purple-500",
        subtle: "text-gray-500",
    }

    return (
        <div className={cn("relative", sizeClasses[size], className)}>
            {/* Outer ring */}
            <motion.div
                className={cn(
                    "absolute inset-0 rounded-full border-2 border-t-transparent border-b-transparent",
                    variantClasses[variant],
                )}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
            />

            {/* Inner ring */}
            <motion.div
                className={cn(
                    "absolute inset-1 rounded-full border-2 border-l-transparent border-r-transparent opacity-70",
                    variantClasses[variant],
                )}
                animate={{ rotate: -360 }}
                transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
            />

            {/* Center dot */}
            <motion.div className={cn("absolute inset-0 flex items-center justify-center", variantClasses[variant])}>
                <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-current"
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
        </div>
    )
}

export function PulseLoader({ className }: { className?: string }) {
    return (
        <div className={cn("flex space-x-2", className)}>
            <motion.div
                className="h-2 w-2 rounded-full bg-blue-500"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
            />
            <motion.div
                className="h-2 w-2 rounded-full bg-blue-500"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
            />
            <motion.div
                className="h-2 w-2 rounded-full bg-blue-500"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
            />
        </div>
    )
}

export function ProgressBar({
    progress = 0,
    className,
}: {
    progress?: number
    className?: string
}) {
    return (
        <div className={cn("h-1 w-full bg-gray-800 rounded-full overflow-hidden", className)}>
            <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    )
}

export function LoadingDots({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center justify-center space-x-1", className)}>
            <motion.span
                className="inline-block h-1 w-1 rounded-full bg-current"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
            />
            <motion.span
                className="inline-block h-1 w-1 rounded-full bg-current"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
            />
            <motion.span
                className="inline-block h-1 w-1 rounded-full bg-current"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
            />
        </div>
    )
}

export function CircularProgress({
    value = 0,
    size = "md",
    className,
}: {
    value?: number
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
}) {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-12 w-12",
        lg: "h-16 w-16",
        xl: "h-24 w-24",
    }

    const radius = 45
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
        <div className={cn("relative", sizeClasses[size], className)}>
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    className="text-gray-800"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                />
                {/* Progress circle */}
                <motion.circle
                    className="text-blue-500"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">{value}%</div>
        </div>
    )
}
