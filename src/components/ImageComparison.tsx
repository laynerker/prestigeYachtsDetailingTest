'use client';

import { useState, useRef, useEffect, TouchEvent, MouseEvent } from 'react';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';

interface ImageComparisonProps {
    imageBefore: string;
    imageAfter: string;
    alt: string;
}

export default function ImageComparison({ imageBefore, imageAfter, alt }: ImageComparisonProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const calculatePosition = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const position = ((clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(position, 0), 100));
    };

    const handleMouseDown = (e: MouseEvent) => {
        setIsDragging(true);
        calculatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        // Touch move doesn't need "isDragging" check if attached directly, 
        // but useful for consistent logic if we want to drag from anywhere
        calculatePosition(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
            if (!isDragging) return;
            calculatePosition(e.clientX);
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden select-none cursor-ew-resize group"
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
        >
            {/* After Image (Background - Clean/Colored) */}
            <div className="absolute inset-0">
                <Image
                    src={imageAfter}
                    alt={`After ${alt}`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-4 right-4 bg-navy/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm z-10 pointer-events-none">
                    AFTER
                </div>
            </div>

            {/* Before Image (Foreground - Dirty/Grayscale) - Clipped */}
            <div
                className="absolute inset-0"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
            >
                <Image
                    src={imageBefore}
                    alt={`Before ${alt}`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-4 left-4 bg-navy/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm z-10 pointer-events-none">
                    BEFORE
                </div>
            </div>

            {/* Slider Handle Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Slider Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-navy hover:scale-110 transition-transform">
                    <ChevronsLeftRight size={20} />
                </div>
            </div>
        </div>
    );
}
