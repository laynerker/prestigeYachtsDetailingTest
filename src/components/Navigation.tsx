'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Navigation({ locale }: { locale: string }) {
    const t = useTranslations('Navigation');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: `/${locale}`, label: t('home') },
        { href: `/${locale}/about`, label: t('about') },

        { href: `/${locale}/services`, label: t('services') },
        { href: `/${locale}/contact`, label: t('contact') },
    ];

    function cn(...inputs: (string | undefined | null | false)[]) {
        return twMerge(clsx(inputs));
    }

    const toggleLanguage = () => {
        // Simplistic toggle
        const newLocale = locale === 'en' ? 'es' : 'en';
        const path = window.location.pathname;
        // Replace the locale segment
        // This is a bit naive if path doesn't start with locale but middleware ensures it does or rewrites
        // With next-intl we usually use a Link with locale prop, but for a switcher:
        let newPath = path;
        if (path.startsWith('/en')) {
            newPath = path.replace('/en', '/es');
        } else if (path.startsWith('/es')) {
            newPath = path.replace('/es', '/en');
        } else {
            newPath = `/${newLocale}${path}`;
        }
        window.location.href = newPath;
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
                isScrolled ? 'bg-navy/95 backdrop-blur-md py-4 shadow-lg border-b border-white/5' : 'bg-transparent py-6'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href={`/${locale}`} className="relative z-50 block">
                    <Image
                        src="/assets/images/logo.png"
                        alt="Prestige Yacht Detailing"
                        width={240}
                        height={80}
                        className={cn(
                            "w-auto object-contain transition-all duration-500",
                            isScrolled ? "h-12 md:h-14" : "h-16 md:h-24"
                        )}
                        priority
                    />
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-white hover:text-gold transition-colors text-sm font-medium uppercase tracking-wide"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button onClick={toggleLanguage} className="text-white hover:text-gold transition-colors flex items-center gap-1 ml-4 border border-white/20 px-3 py-1 rounded-full text-xs">
                        <Globe size={14} />
                        <span className="uppercase">{locale}</span>
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white z-50 p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu Overlay */}
                <div
                    className={cn(
                        'fixed inset-0 bg-navy/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden',
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    )}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-white text-2xl font-serif"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button onClick={toggleLanguage} className="text-white mt-8 flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full">
                        <Globe size={20} />
                        <span className="uppercase">{locale === 'en' ? 'Español' : 'English'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
