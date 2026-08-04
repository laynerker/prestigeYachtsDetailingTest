'use client';

import { useState, useRef, useEffect, TouchEvent, MouseEvent, KeyboardEvent } from 'react';
import Image from 'next/image';
import { ChevronsLeftRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ImageComparisonProps {
    imageBefore: string;
    imageAfter: string;
    alt: string;
    initialPosition?: number;
    revealOnMount?: boolean;
    altBefore?: string;
    altAfter?: string;
}

export default function ImageComparison({
    imageBefore,
    imageAfter,
    alt,
    initialPosition = 50,
    revealOnMount = false,
    altBefore,
    altAfter,
}: ImageComparisonProps) {
    const t = useTranslations('ImageComparison');
    const [sliderPosition, setSliderPosition] = useState(revealOnMount ? 2 : initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isRevealing, setIsRevealing] = useState(revealOnMount);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasInteractedRef = useRef(false);

    // Determine alt text based on whether altBefore/altAfter are provided
    const hasExplicitAltTexts = altBefore !== undefined && altAfter !== undefined;
    const beforeAltText = hasExplicitAltTexts ? altBefore : `${t('before')}: ${alt}`;
    const afterAltText = hasExplicitAltTexts ? altAfter : `${t('after')}: ${alt}`;
    const ariaLabel = hasExplicitAltTexts ? `${altBefore} / ${altAfter}` : t('compareLabel', { alt });

    const calculatePosition = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const position = ((clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(position, 0), 100));
    };

    const handleMouseDown = (e: MouseEvent) => {
        hasInteractedRef.current = true;
        setIsRevealing(false);
        setIsDragging(true);
        calculatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        hasInteractedRef.current = true;
        setIsRevealing(false);
        calculatePosition(e.touches[0].clientX);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            hasInteractedRef.current = true;
            setIsRevealing(false);
            e.preventDefault();
            setSliderPosition((p) => Math.max(p - 5, 0));
        } else if (e.key === 'ArrowRight') {
            hasInteractedRef.current = true;
            setIsRevealing(false);
            e.preventDefault();
            setSliderPosition((p) => Math.min(p + 5, 100));
        }
    };

    useEffect(() => {
        if (!revealOnMount) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSliderPosition(initialPosition);
            setIsRevealing(false);
            return;
        }

        // Snap to initialPosition after 150ms (unless user has already interacted)
        const snapTimeout = setTimeout(() => {
            if (!hasInteractedRef.current) {
                setSliderPosition(initialPosition);
            }
        }, 150);

        // Disable transitions after animation completes (150ms snap + 1.2s transition = 1350ms)
        const completeTimeout = setTimeout(() => {
            setIsRevealing(false);
        }, 1350);

        return () => {
            clearTimeout(snapTimeout);
            clearTimeout(completeTimeout);
        };
    }, [revealOnMount, initialPosition]);

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
            role="slider"
            tabIndex={0}
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ariaLabel}
            className="relative w-full h-full overflow-hidden select-none cursor-ew-resize group focus:outline-none focus-visible:ring-2 focus-visible:ring-teak focus-visible:ring-offset-2 focus-visible:ring-offset-slipway"
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
            onKeyDown={handleKeyDown}
        >
            <div className="absolute inset-0">
                <Image
                    src={imageAfter}
                    alt={afterAltText}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-4 right-4 bg-slipway/80 text-gelcoat text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm z-10 pointer-events-none">
                    {t('after').toUpperCase()}
                </div>
            </div>

            <div
                className="absolute inset-0"
                style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    transition: isRevealing ? 'clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
                }}
            >
                <Image
                    src={imageBefore}
                    alt={beforeAltText}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-4 left-4 bg-slipway/80 text-gelcoat text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm z-10 pointer-events-none">
                    {t('before').toUpperCase()}
                </div>
            </div>

            <div
                className="absolute top-0 bottom-0 w-1 bg-gelcoat cursor-ew-resize z-20"
                style={{
                    left: `${sliderPosition}%`,
                    transition: isRevealing ? 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
                }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gelcoat rounded-full flex items-center justify-center shadow-lg text-slipway hover:scale-110 transition-transform">
                    <ChevronsLeftRight size={20} />
                </div>
            </div>
        </div>
    );
}
