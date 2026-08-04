'use client';
import { useTranslations } from 'next-intl';
import { SERVICES } from '@/data/services';
import ImageComparison from './ImageComparison';

export default function RecentWork() {
    const t = useTranslations('RecentWork');
    const tServices = useTranslations('Services');

    return (
        <section className="bg-slipway py-24 border-t border-gelcoat/5">
            <div className="container mx-auto px-4 max-w-7xl">
                <span className="text-eyebrow block mb-4">{t('eyebrow')}</span>
                <h2 className="text-heading-1 text-gelcoat mb-16 max-w-2xl">{t('title')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {SERVICES.map((item) => (
                        <div key={item.id} className="flex flex-col gap-4">
                            <div className="relative h-[280px] overflow-hidden">
                                <ImageComparison
                                    imageBefore={item.imageBefore}
                                    imageAfter={item.imageAfter}
                                    alt={item.title}
                                />
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-eyebrow">{item.material}</span>
                                <h3 className="text-heading-3 text-gelcoat">
                                    {tServices(`items.${item.id}.description`)}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
