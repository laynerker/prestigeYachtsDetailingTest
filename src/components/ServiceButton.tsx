'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ServiceButtonProps {
    serviceTitle: string;
    whatsappText: string;
    buttonText: string;
    locale: string;
}

export default function ServiceButton({ serviceTitle, whatsappText, buttonText, locale }: ServiceButtonProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            const ua = navigator.userAgent;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
                return true;
            }
            return window.innerWidth <= 768;
        };

        setIsMobile(checkMobile());
    }, []);

    // Prevent hydration mismatch by rendering a generic button until mounted
    // We render it as a disabled button so the layout doesn't shift
    if (!mounted) {
        return (
            <button disabled className="inline-block px-8 py-3 bg-slipway text-gelcoat font-serif tracking-wide rounded opacity-50 cursor-default drop-shadow-md">
                {buttonText}
            </button>
        );
    }

    if (isMobile) {
        return (
            <a
                href={`https://wa.me/19548534995?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-slipway text-gelcoat font-serif tracking-wide rounded hover:bg-teak transition-colors drop-shadow-md"
            >
                {buttonText}
            </a>
        );
    }

    return (
        <Link
            href={`/${locale}/contact?service=${encodeURIComponent(serviceTitle)}`}
            className="inline-block px-8 py-3 bg-slipway text-gelcoat font-serif tracking-wide rounded hover:bg-teak transition-colors drop-shadow-md"
        >
            {buttonText}
        </Link>
    );
}
