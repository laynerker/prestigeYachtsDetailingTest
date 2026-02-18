'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ locale }: { locale: string }) {
    const t = useTranslations('Footer');
    const navT = useTranslations('Navigation'); // Reuse nav translations

    return (
        <footer className="bg-navy text-gold pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                {/* Col 1: Brand */}
                <div className="space-y-6">
                    <div className="mb-4">
                        <Image
                            src="/assets/images/logo.png"
                            alt="Prestige Yacht Detailing"
                            width={220}
                            height={80}
                            className="h-32 w-auto object-contain"
                        />
                    </div>
                    <p className="text-gold/80 leading-relaxed max-w-sm text-sm">
                        {t('slogan')}
                    </p>
                </div>

                {/* Col 2: Info */}
                <div className="md:px-8">
                    <h3 className="text-lg font-semibold mb-8 text-gold uppercase tracking-wider">{t('quickLinks')}</h3>
                    <ul className="space-y-4">
                        <li><Link href={`/${locale}`} className="text-gold hover:text-white hover:translate-x-1 transition-all inline-block">{navT('home')}</Link></li>
                        <li><Link href={`/${locale}/about`} className="text-gold hover:text-white hover:translate-x-1 transition-all inline-block">{navT('about')}</Link></li>

                        <li><Link href={`/${locale}/services`} className="text-gold hover:text-white hover:translate-x-1 transition-all inline-block">{navT('services')}</Link></li>
                        <li><Link href={`/${locale}/contact`} className="text-gold hover:text-white hover:translate-x-1 transition-all inline-block">{navT('contact')}</Link></li>
                    </ul>
                </div>

                {/* Col 3: Contact */}
                <div>
                    <h3 className="text-lg font-semibold mb-8 text-gold uppercase tracking-wider">{t('contact')}</h3>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold/20 transition-colors">
                                <Phone className="text-gold" size={18} />
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gold/60 mb-1">Call Us</span>
                                <a href="tel:+13051234567" className="text-gold group-hover:text-white transition-colors font-medium">+1 (305) 123-4567</a>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold/20 transition-colors">
                                <Mail className="text-gold" size={18} />
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gold/60 mb-1">Email Us</span>
                                <a href="mailto:contact@prestigeyachts.com" className="text-gold group-hover:text-white transition-colors font-medium">contact@prestigeyachts.com</a>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold/20 transition-colors">
                                <MapPin className="text-gold" size={18} />
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gold/60 mb-1">Visit Us</span>
                                <span className="text-gold block">Miami Beach Marina, FL</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-8 border-t border-white/5 text-center text-xs text-gray-600 uppercase tracking-widest">
                {t('copyright')}
            </div>
        </footer>
    );
}
