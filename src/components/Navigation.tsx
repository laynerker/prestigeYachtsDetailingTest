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
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

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
        const newLocale = locale === 'en' ? 'es' : 'en';
        const path = window.location.pathname;
        let newPath = path;
        if (path.startsWith('/en')) {
            newPath = path.replace('/en', '/es');
        } else if (path.startsWith('/es')) {
            newPath = path.replace('/es', '/en');
        } else {
            const parts = path.split('/');
            if (parts[1] === locale) {
                parts[1] = newLocale;
                newPath = parts.join('/');
            } else {
                newPath = `/${newLocale}${path}`;
            }
        }
        window.location.href = newPath;
    };

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out',
                    isScrolled && !isMobileMenuOpen ? 'bg-slipway/85 backdrop-blur-xl py-2 md:py-3 shadow-2xl border-b border-white/5' : 'bg-gradient-to-b from-slipway/50 to-transparent py-6 md:py-8',
                    isMobileMenuOpen && 'bg-slipway flex items-center h-20 md:h-auto py-4'
                )}
            >
                <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                    <Link href={`/${locale}`} className="relative z-50 block" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image
                            src="/assets/images/logo.png"
                            alt="Prestige Yacht Detailing"
                            width={240}
                            height={80}
                            className={cn(
                                "w-auto object-contain transition-all duration-700 ease-in-out",
                                isScrolled && !isMobileMenuOpen ? "h-9 md:h-12" : "h-12 md:h-16"
                            )}
                            priority
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative text-white/80 hover:text-teak transition-colors duration-300 text-xs font-medium uppercase tracking-[0.2em] py-2 group"
                            >
                                {link.label}
                                <span className="absolute bottom-1 left-0 w-0 h-[1px] bg-teak transition-all duration-300 group-hover:w-full opacity-50"></span>
                            </Link>
                        ))}
                        <button
                            onClick={toggleLanguage}
                            className="text-white/80 hover:text-teak transition-colors duration-300 flex items-center gap-2 ml-4 border border-white/20 hover:border-teak/50 px-4 py-2 rounded-full text-xs font-medium tracking-widest bg-white/5 backdrop-blur-sm"
                        >
                            <Globe size={14} className="opacity-70" />
                            <span className="uppercase">{locale}</span>
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    'fixed inset-0 bg-slipway/98 backdrop-blur-2xl z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden',
                    isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                )}
            >
                <nav className="flex flex-col items-center gap-8 w-full px-6">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-white text-4xl w-full text-center py-4 border-b border-white/5 hover:text-teak transition-all duration-300 transform",
                                isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                            )}
                            style={{ transitionDelay: `${index * 100}ms` }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className={cn(
                        "mt-12 transition-all duration-500 transform",
                        isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    )}
                        style={{ transitionDelay: `${navLinks.length * 100}ms` }}
                    >
                        <button
                            onClick={toggleLanguage}
                            className="text-teak flex items-center justify-center w-full max-w-[200px] gap-3 border border-teak/40 px-8 py-3 rounded-full hover:bg-teak hover:text-slipway transition-all duration-300 text-lg font-medium"
                        >
                            <Globe size={24} />
                            <span className="uppercase">{locale === 'en' ? 'Español' : 'English'}</span>
                        </button>
                    </div>
                </nav>

                {/* Background decorative element */}
                <div className="absolute bottom-12 opacity-10 pointer-events-none">
                    <Image
                        src="/assets/images/logo.png"
                        alt="Logo Watermark"
                        width={300}
                        height={100}
                        className="w-auto h-20 object-contain grayscale"
                    />
                </div>
            </div>
        </>
    );
}
