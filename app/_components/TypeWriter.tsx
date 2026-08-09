"use client"

import {motion} from 'motion/react';
import React, {useState, useEffect} from 'react';

interface TypeWriterProps {
    children: string;
    delay?: number;
    className?: string;
    hideEndCursor?: boolean;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
                                                   children,
                                                   delay = 100,
                                                   className = "",
                                                   hideEndCursor = false
                                               }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [finished, setFinished] = useState(false)
    const text = children
    const displayText = text.slice(0, currentIndex)

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, delay);

            return () => clearTimeout(timeout);
        } else {
            setFinished(true);
        }
    }, [currentIndex, delay, text]);

    // Blinking cursor effect
    useEffect(() => {
        if (finished && hideEndCursor) {
            return;
        }
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, [finished]);

    return (
        <span className={`relative inline-block ${className}`}>
      <span className="opacity-0">{text}</span>
      <span aria-hidden="true" className="absolute inset-0 top-0 left-0">
        {displayText}
            <motion.span
                className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ease-in-out`}>
                |
            </motion.span>
      </span>
    </span>
    );
};

export default TypeWriter;
