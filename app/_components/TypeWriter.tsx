"use client"

import {motion} from 'motion/react';
import React, {useState, useEffect} from 'react';

interface TypeWriterProps {
    children: string;
    delay?: number;
    className?: string;
    textClassName?: string;
    hideEndCursor?: boolean;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
                                                   children,
                                                   delay = 100,
                                                   className = "",
                                                   textClassName = "",
                                                   hideEndCursor = false
                                               }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const text = children
    const displayText = text.slice(0, currentIndex)
    const finished = currentIndex >= text.length

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
            }, delay);

            return () => clearTimeout(timeout);
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
    }, [finished, hideEndCursor]);

    return (
        <span className={`relative inline-grid ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={`invisible col-start-1 row-start-1 ${textClassName}`}>{text}</span>
      <span aria-hidden="true" className={`col-start-1 row-start-1 ${textClassName}`}>
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
