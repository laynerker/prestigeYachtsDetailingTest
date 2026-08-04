'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

const WhatsAppIcon = ({ size = 22, className = "" }: { size?: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        stroke="none"
        className={className}
    >
        <path d="M11.99 2C6.47 2 2 6.48 2 12c0 1.76.45 3.42 1.25 4.9L2 22l5.24-1.21c1.44.75 3.07 1.18 4.75 1.18 5.52 0 10-4.48 10-10V12c0-5.52-4.48-10-10-10zm0 18.3c-1.46 0-2.88-.38-4.14-1.09l-.3-.17-3.08.71.72-2.98-.19-.3C4.24 15.01 3.79 13.54 3.79 12c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2zm4.49-6.14c-.25-.13-1.46-.72-1.69-.8-.23-.08-.39-.13-.56.13-.17.26-.64.8-.78.96-.15.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.72-.14-.26-.01-.39.12-.52.12-.12.25-.26.38-.39.13-.13.17-.22.25-.38.08-.15.04-.29-.02-.42-.06-.13-.56-1.36-.77-1.86-.21-.49-.41-.42-.56-.43-.14-.01-.3-.01-.46-.01-.16 0-.41.06-.63.3-.22.24-.84.82-.84 2.01 0 1.19.86 2.34.98 2.51.12.17 1.71 2.62 4.14 3.67.58.25 1.04.4 1.39.51.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z"/>
    </svg>
);

export default function Footer({ locale }: { locale: string }) {
    const t = useTranslations('Footer');
    const navT = useTranslations('Navigation'); // Reuse nav translations

    return (
        <footer className="bg-slipway relative overflow-hidden pt-24 pb-8 border-t border-teak/10">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teak/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container relative z-10 mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20 text-center md:text-left">
                    
                    {/* Col 1: Brand & Slogan */}
                    <div className="col-span-1 md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left mb-12 md:mb-0">
                        <Link href={`/${locale}`} className="transform hover:scale-105 transition-transform duration-500 ease-out mb-8 inline-block">
                            <Image
                                src="/assets/images/logoFooter.png"
                                alt="Prestige Yacht Detailing"
                                width={260}
                                height={90}
                                className="h-28 md:h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(192,138,74,0.15)]"
                            />
                        </Link>

                        {/* Gradient divider: centered on mobile, left-aligned on desktop */}
                        <div className="w-56 md:w-48 h-px bg-gradient-to-r from-transparent via-teak/60 to-transparent md:from-teak/60 md:via-teak/30 md:to-transparent mb-8"></div>
                        
                        <p className="text-chalk leading-[2] text-sm lg:text-base font-light tracking-wide max-w-md mx-auto md:mx-0">
                            {t('slogan')}
                        </p>
                    </div>

                    {/* Col 2: Links */}
                    <div className="col-span-1 md:col-span-3 flex flex-col items-center md:items-start md:pl-8 lg:pl-16">
                        <p className="text-gelcoat/90 uppercase tracking-[0.2em] text-sm font-sans font-semibold mb-8 border-b border-teak/30 pb-2 hidden md:block w-full">{t('quickLinks')}</p>
                        <ul className="flex flex-col md:flex-col gap-6 md:gap-4 items-center md:items-start">
                            {['home', 'about', 'services', 'contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${locale}${item === 'home' ? '' : `/${item}`}`}
                                        className="text-chalk hover:text-gelcoat uppercase tracking-[0.15em] text-xs md:text-sm font-medium transition-colors duration-300 relative group py-1 block"
                                    >
                                        {navT(item)}
                                        <span className="absolute bottom-0 left-1/2 md:left-0 w-0 h-px bg-teak transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-50"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Contact Icons */}
                    <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-start md:pl-8 lg:pl-16">
                        <p className="text-gelcoat/90 uppercase tracking-[0.2em] text-sm font-sans font-semibold mb-8 border-b border-teak/30 pb-2 hidden md:block w-full">{t('contact')}</p>
                        <ul className="flex flex-row md:flex-row flex-wrap items-center justify-center md:justify-start gap-4 lg:gap-6">
                            <li>
                                <a href="https://wa.me/19548534995" target="_blank" rel="noopener noreferrer" title="WhatsApp +1 (954) 853-4995" className="block group" aria-label="WhatsApp">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-teak/30 flex items-center justify-center text-teak group-hover:bg-teak group-hover:text-slipway group-hover:border-teak transition-all duration-500 hover:shadow-[0_0_20px_rgba(192,138,74,0.3)]">
                                        <WhatsAppIcon size={22} className="md:w-6 md:h-6 stroke-[1.5]" />
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+19548534995" title="+1 (954) 853-4995" className="block group" aria-label="Phone Number">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-teak/30 flex items-center justify-center text-teak group-hover:bg-teak group-hover:text-slipway group-hover:border-teak transition-all duration-500 hover:shadow-[0_0_20px_rgba(192,138,74,0.3)]">
                                        <Phone size={22} className="md:w-6 md:h-6 stroke-[1.5]" />
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contact@prestigeyachtsdetailing.com" title="contact@prestigeyachtsdetailing.com" className="block group" aria-label="Email Address">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-teak/30 flex items-center justify-center text-teak group-hover:bg-teak group-hover:text-slipway group-hover:border-teak transition-all duration-500 hover:shadow-[0_0_20px_rgba(192,138,74,0.3)]">
                                        <Mail size={22} className="md:w-6 md:h-6 stroke-[1.5]" />
                                    </div>
                                </a>
                            </li>
                            <li>
                                <Link href={`/${locale}/contact`} className="block group" title="Miami · Miami Beach · South Florida · Fort Lauderdale" aria-label="Location">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-teak/30 flex items-center justify-center text-teak group-hover:bg-teak group-hover:text-slipway group-hover:border-teak transition-all duration-500 hover:shadow-[0_0_20px_rgba(192,138,74,0.3)]">
                                        <MapPin size={22} className="md:w-6 md:h-6 stroke-[1.5]" />
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-[10px] md:text-xs text-chalk/60 uppercase tracking-widest text-center md:text-left w-full">
                        {t('copyright')}
                    </div>
                </div>
            </div>
        </footer>
    );
}
