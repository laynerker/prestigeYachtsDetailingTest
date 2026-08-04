'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import ImageComparison from './ImageComparison';

export default function Hero() {
    const t = useTranslations('Home');
    const locale = useLocale();

    return (
        <section className="relative w-full bg-slipway overflow-hidden">
            <div className="relative h-[70vh] min-h-[480px] w-full">
                <ImageComparison
                    imageBefore="/assets/images/services/wash_down_antes.webp"
                    imageAfter="/assets/images/services/wash_down_despues.webp"
                    alt="yacht hull wash comparison"
                    altBefore={t('heroBeforeAlt')}
                    altAfter={t('heroAfterAlt')}
                    initialPosition={55}
                    revealOnMount
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slipway via-slipway/10 to-transparent pointer-events-none" />
            </div>

            <div className="noise-overlay" />

            <div className="relative z-10 px-4 py-16 md:py-20 max-w-5xl mx-auto text-center">
                <span className="text-eyebrow block mb-6">
                    Prestige Yachts Detailing
                </span>
                <h1 className="text-display text-gelcoat mb-6">
                    {t('title')}
                </h1>
                <p className="text-body text-chalk text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                    {t('subtitle')}
                </p>
                <Link
                    href={`/${locale}/services`}
                    className="inline-flex items-center justify-center px-10 py-5 bg-teak text-slipway font-medium tracking-[0.15em] uppercase text-sm hover:bg-teak-deep transition-colors duration-300 rounded-sm"
                >
                    {t('cta')}
                </Link>
            </div>
        </section>
    );
}
