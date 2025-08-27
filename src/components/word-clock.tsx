
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const words = [
    ['I', 'T', 'L', 'I', 'S', 'A', 'S', 'A', 'M', 'P', 'M'],
    ['A', 'C', 'Q', 'U', 'A', 'R', 'T', 'E', 'R', 'D', 'C'],
    ['T', 'W', 'E', 'N', 'T', 'Y', 'F', 'I', 'V', 'E', 'X'],
    ['H', 'A', 'L', 'F', 'B', 'T', 'E', 'N', 'F', 'T', 'O'],
    ['P', 'A', 'S', 'T', 'E', 'R', 'U', 'N', 'I', 'N', 'E'],
    ['O', 'N', 'E', 'S', 'I', 'X', 'T', 'H', 'R', 'E', 'E'],
    ['F', 'O', 'U', 'R', 'F', 'I', 'V', 'E', 'T', 'W', 'O'],
    ['E', 'I', 'G', 'H', 'T', 'E', 'L', 'E', 'V', 'E', 'N'],
    ['S', 'E', 'V', 'E', 'N', 'T', 'W', 'E', 'L', 'V', 'E'],
    ['T', 'E', 'N', 'S', 'E', 'O', 'C', 'L', 'O', 'C', 'K'],
];

const wordMap: { [key: string]: [number, number, number] } = {
    'IT': [0, 0, 2],
    'IS': [0, 3, 2],
    'A': [1, 0, 1],
    'QUARTER': [1, 2, 7],
    'TWENTY': [2, 0, 6],
    'FIVE_MIN': [2, 6, 4],
    'HALF': [3, 0, 4],
    'TEN_MIN': [3, 6, 3],
    'TO': [3, 10, 2],
    'PAST': [4, 0, 4],
    'NINE': [4, 9, 4],
    'ONE': [5, 0, 3],
    'SIX': [5, 3, 3],
    'THREE': [5, 7, 5],
    'FOUR': [6, 0, 4],
    'FIVE_HOUR': [6, 4, 4],
    'TWO': [6, 9, 3],
    'EIGHT': [7, 0, 5],
    'ELEVEN': [7, 5, 6],
    'SEVEN': [8, 0, 5],
    'TWELVE': [8, 6, 6],
    'TEN_HOUR': [9, 0, 3],
    'OCLOCK': [9, 5, 6],
};

const getTimeAsWords = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const activeWords = new Set(['IT', 'IS']);
    
    let displayHour = hours % 12;
    if (displayHour === 0) displayHour = 12;

    const roundedMinutes = Math.floor(minutes / 5) * 5;
    
    let hourGoesUp = false;
    
    if (roundedMinutes > 30) {
        hourGoesUp = true;
    }

    switch (roundedMinutes) {
        case 0:
            activeWords.add('OCLOCK');
            break;
        case 5:
            activeWords.add('FIVE_MIN');
            activeWords.add('PAST');
            break;
        case 10:
            activeWords.add('TEN_MIN');
            activeWords.add('PAST');
            break;
        case 15:
            activeWords.add('A');
            activeWords.add('QUARTER');
            activeWords.add('PAST');
            break;
        case 20:
            activeWords.add('TWENTY');
            activeWords.add('PAST');
            break;
        case 25:
            activeWords.add('TWENTY');
            activeWords.add('FIVE_MIN');
            activeWords.add('PAST');
            break;
        case 30:
            activeWords.add('HALF');
            activeWords.add('PAST');
            break;
        case 35:
            activeWords.add('TWENTY');
            activeWords.add('FIVE_MIN');
            activeWords.add('TO');
            break;
        case 40:
            activeWords.add('TWENTY');
            activeWords.add('TO');
            break;
        case 45:
            activeWords.add('A');
            activeWords.add('QUARTER');
            activeWords.add('TO');
            break;
        case 50:
            activeWords.add('TEN_MIN');
            activeWords.add('TO');
            break;
        case 55:
            activeWords.add('FIVE_MIN');
            activeWords.add('TO');
            break;
    }

    if(hourGoesUp) {
        displayHour = (displayHour % 12) + 1;
    }

    switch (displayHour) {
        case 1: activeWords.add('ONE'); break;
        case 2: activeWords.add('TWO'); break;
        case 3: activeWords.add('THREE'); break;
        case 4: activeWords.add('FOUR'); break;
        case 5: activeWords.add('FIVE_HOUR'); break;
        case 6: activeWords.add('SIX'); break;
        case 7: activeWords.add('SEVEN'); break;
        case 8: activeWords.add('EIGHT'); break;
        case 9: activeWords.add('NINE'); break;
        case 10: activeWords.add('TEN_HOUR'); break;
        case 11: activeWords.add('ELEVEN'); break;
        case 12: activeWords.add('TWELVE'); break;
    }
    
    return activeWords;
};

export function WordClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const activeWords = getTimeAsWords(time);
    const activePositions = new Set<string>();
    activeWords.forEach(wordKey => {
        const [row, start, len] = wordMap[wordKey];
        for (let i = 0; i < len; i++) {
            activePositions.add(`${row}-${start + i}`);
        }
    });

    return (
        <div className="bg-background py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Current Time</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        A unique way to visualize time, inspired by Kerala's blend of tradition and modernity.
                    </p>
                </div>
                 <div className="max-w-xl mx-auto p-4 md:p-8 rounded-lg bg-card border">
                    <div className="flex flex-col items-center justify-center font-headline font-bold tracking-widest text-2xl md:text-4xl">
                        {words.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex">
                                {row.map((char, charIndex) => (
                                    <span 
                                        key={charIndex} 
                                        className={cn(
                                            "flex items-center justify-center m-1 p-1 w-8 h-8 md:w-10 md:h-10 transition-colors duration-500",
                                            activePositions.has(`${rowIndex}-${charIndex}`) 
                                                ? 'text-primary' 
                                                : 'text-muted-foreground/30'
                                        )}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
