'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ locale }: { locale: string }) {
    const t = useTranslations('Footer');
    const navT = useTranslations('Navigation'); // Reuse nav translations

    return (
        <footer className="bg-navy text-white pt-20 pb-10 border-t border-white/10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                {/* Col 1: Brand */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold tracking-tight">Prestige Yachts</h2>
                    <p className="text-gray-400 leading-relaxed max-w-sm text-sm">
                        {t('slogan')}
                    </p>
                </div>

                {/* Col 2: Info */}
                <div className="md:px-8">
                    <h3 className="text-lg font-semibold mb-8 text-white uppercase tracking-wider">{t('quickLinks')}</h3>
                    <ul className="space-y-4">
                        <li><Link href={`/${locale}`} className="text-gray-400 hover:text-gold hover:translate-x-1 transition-all inline-block">{navT('home')}</Link></li>
                        <li><Link href={`/${locale}/about`} className="text-gray-400 hover:text-gold hover:translate-x-1 transition-all inline-block">{navT('about')}</Link></li>
                        <li><Link href={`/${locale}/yachts`} className="text-gray-400 hover:text-gold hover:translate-x-1 transition-all inline-block">{navT('yachts')}</Link></li>
                        <li><Link href={`/${locale}/addons`} className="text-gray-400 hover:text-gold hover:translate-x-1 transition-all inline-block">{navT('addons')}</Link></li>
                        <li><Link href={`/${locale}/contact`} className="text-gray-400 hover:text-gold hover:translate-x-1 transition-all inline-block">{navT('contact')}</Link></li>
                    </ul>
                </div>

                {/* Col 3: Contact */}
                <div>
                    <h3 className="text-lg font-semibold mb-8 text-white uppercase tracking-wider">{t('contact')}</h3>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold/20 transition-colors">
                                <Phone className="text-gold" size={18} />
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-500 mb-1">Call Us</span>
                                <a href="tel:+13051234567" className="text-gray-300 group-hover:text-gold transition-colors font-medium">+1 (305) 123-4567</a>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold/20 transition-colors">
                                <Mail className="text-gold" size={18} />
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-500 mb-1">Email Us</span>
                                <a href="mailto:contact@prestigeyachts.com" className="text-gray-300 group-hover:text-gold transition-colors font-medium">contact@prestigeyachts.com</a>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 group">
                            <div className="p-2 bg-white/5 rounded-full group-hover:bg-gold/20 transition-colors">
                                <MapPin className="text-gold" size={18} />
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-500 mb-1">Visit Us</span>
                                <span className="text-gray-300 block">Miami Beach Marina, FL</span>
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
