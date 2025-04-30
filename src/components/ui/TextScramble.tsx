'use client';

import { useEffect, useRef } from 'react';

interface TextScrambleProps {
    text: string;
    className?: string;
}

const TextScramble = ({ text, className = '' }: TextScrambleProps) => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    
    useEffect(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval: NodeJS.Timeout | null = null;
    
    const handleMouseOver = (event: MouseEvent) => {
        let iteration = 0;
    if (interval) clearInterval(interval);
        const target = event.target as HTMLHeadingElement;
        const originalText = text;
        interval = setInterval(() => {
            target.innerText = originalText
                .split("")
                .map((letter, index) => {
            if (index < iteration) {
                return originalText[index];
            }
            
            return letters[Math.floor(Math.random() * 26)];
            })
            .join("");
        
        if (iteration >= originalText.length) { 
            if (interval) clearInterval(interval);
        }
        
            iteration += 1 / 3;
        }, 30);
    };
    
    const headingElement = headingRef.current;
    
    if (headingElement) {
        headingElement.addEventListener('mouseover', handleMouseOver);
        return () => {
            headingElement.removeEventListener('mouseover', handleMouseOver);
            if (interval) clearInterval(interval);
        };
        }
    }, [text]); 
    return (
    <h1 
        ref={headingRef} 
        data-value={text}
        className={className}
    >
        {text}
    </h1>
    );
};

export default TextScramble;