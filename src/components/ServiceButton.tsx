'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ServiceButtonProps {
    serviceTitle: string;
    whatsappText: string;
    buttonText: string;
    locale: string;
    dark?: boolean;
}

export default function ServiceButton({ serviceTitle, whatsappText, buttonText, locale, dark = false }: ServiceButtonProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const colorClasses = dark
        ? 'bg-teak text-slipway hover:bg-teak-deep hover:text-gelcoat'
        : 'bg-slipway text-gelcoat hover:bg-teak';

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
            <button disabled className={`inline-block px-8 py-3 ${colorClasses} font-sans tracking-wide rounded opacity-50 cursor-default drop-shadow-md`}>
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
                className={`inline-block px-8 py-3 ${colorClasses} font-sans tracking-wide rounded transition-colors drop-shadow-md`}
            >
                {buttonText}
            </a>
        );
    }

    return (
        <Link
            href={`/${locale}/contact?service=${encodeURIComponent(serviceTitle)}`}
            className={`inline-block px-8 py-3 ${colorClasses} font-sans tracking-wide rounded transition-colors drop-shadow-md`}
        >
            {buttonText}
        </Link>
    );
}
