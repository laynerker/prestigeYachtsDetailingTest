'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/data/services';
import ImageComparison from './ImageComparison';

const FEATURED_IDS = ['washDown', 'engineRoomCare'];

export default function RecentWork() {
    const t = useTranslations('RecentWork');
    const tServices = useTranslations('Services');
    const locale = useLocale();

    const featured = SERVICES.filter((item) => FEATURED_IDS.includes(item.id));

    return (
        <section className="bg-slipway py-24 border-t border-gelcoat/5">
            <div className="container mx-auto px-4 max-w-7xl">
                <span className="text-eyebrow text-chalk block mb-4">{t('eyebrow')}</span>
                <h2 className="text-heading-1 text-teak mb-16 max-w-2xl">{t('title')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-teak/15 gap-12 md:gap-0">
                    {featured.map((item) => (
                        <div key={item.id} className="flex flex-col gap-5 md:px-12 md:first:pl-0 md:last:pr-0">
                            <div className="relative h-[320px] md:h-[460px] overflow-hidden">
                                <ImageComparison
                                    imageBefore={item.imageBefore}
                                    imageAfter={item.imageAfter}
                                    alt={tServices(`items.${item.id}.description`)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-eyebrow text-teak">{item.material}</span>
                                <h3 className="text-heading-3 text-gelcoat">
                                    {tServices(`items.${item.id}.description`)}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <Link
                        href={`/${locale}/services`}
                        className="inline-flex items-center gap-2 text-teak hover:text-gelcoat transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium group"
                    >
                        {t('cta')}
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
