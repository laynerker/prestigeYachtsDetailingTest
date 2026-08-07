'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { assetPath } from '@/lib/assetPath';

export default function Hero() {
    const t = useTranslations('Home');
    const locale = useLocale();

    return (
        <section className="relative h-dvh min-h-[640px] w-full overflow-hidden bg-slipway">
            <div className="absolute inset-0">
                <Image
                    src={assetPath('/assets/images/hero.png')}
                    alt={t('heroImageAlt')}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slipway/70 via-slipway/45 to-slipway/85" />
            </div>

            <div className="noise-overlay" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-10 text-center max-w-4xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="text-eyebrow text-chalk block mb-5"
                >
                    Prestige Yachts Detailing
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                    className="text-display text-teak mb-5"
                >
                    {t('title')}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    className="text-body text-chalk text-lg md:text-xl mb-9 max-w-2xl leading-relaxed"
                >
                    {t('subtitle')}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
                >
                    <Link
                        href={`/${locale}/services`}
                        className="inline-flex items-center justify-center px-10 py-5 bg-teak text-slipway font-medium tracking-[0.15em] uppercase text-sm hover:bg-teak-deep transition-colors duration-300 rounded-sm"
                    >
                        {t('cta')}
                    </Link>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
            >
                <div className="w-px h-12 bg-gradient-to-b from-teak/0 via-teak/70 to-teak/0 mb-3 overflow-hidden">
                    <motion.div
                        className="w-full h-1/2 bg-gelcoat"
                        animate={{ y: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                    />
                </div>
                <span className="text-caption text-chalk tracking-[0.3em] uppercase text-[10px]">Scroll</span>
            </motion.div>
        </section>
    );
}
