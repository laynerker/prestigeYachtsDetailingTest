import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ImageComparison from '@/components/ImageComparison';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ServiceButton from '@/components/ServiceButton';
import { SERVICES } from '@/data/services';

export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Services');
    const tContact = await getTranslations('Contact');

    return (
        <main className="flex min-h-screen flex-col">
            <Navigation locale={locale} />

            <section className="bg-slipway pt-40 pb-16 px-4 text-center">
                <h1 className="text-heading-1 text-gelcoat">{t('headerTitle')}</h1>
            </section>

            {SERVICES.map((item, index) => (
                <section
                    key={index}
                    id={item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                    className={index % 2 === 0 ? 'bg-gelcoat' : 'bg-slipway'}
                >
                    <div className="container mx-auto px-4 py-20 scroll-mt-32">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            {index % 2 === 0 ? (
                                <>
                                    <div className="w-full md:w-1/2 h-[400px] relative overflow-hidden shadow-xl">
                                        <ImageComparison
                                            imageBefore={item.imageBefore}
                                            imageAfter={item.imageAfter}
                                            alt={t(`items.${item.id}.description`)}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <span className="text-eyebrow text-teak-deep block mb-3">{item.material}</span>
                                        <h2 className="text-heading-2 text-slipway mb-4">{item.title}</h2>
                                        <h3 className="text-heading-3 text-teak-deep mb-4">{t(`items.${item.id}.description`)}</h3>
                                        <p className="text-body text-slipway/70 mb-6 leading-relaxed">
                                            {t('pricingNote')}
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            {Array.from({ length: item.itemCount }).map((_, i) => (
                                                <li key={i} className="flex items-center gap-3 text-slipway/80">
                                                    <span className="w-2 h-2 rounded-full bg-teak"></span>
                                                    {t(`items.${item.id}.items.${i}`)}
                                                </li>
                                            ))}
                                        </ul>
                                        <ServiceButton
                                            serviceTitle={item.title}
                                            whatsappText={encodeURIComponent(tContact('defaultMessage', { service: item.title }))}
                                            buttonText={t('requestAppointment')}
                                            locale={locale}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full md:w-1/2">
                                        <span className="text-eyebrow text-chalk block mb-3">{item.material}</span>
                                        <h2 className="text-heading-2 text-gelcoat mb-4">{item.title}</h2>
                                        <h3 className="text-heading-3 text-teak mb-4">{t(`items.${item.id}.description`)}</h3>
                                        <p className="text-body text-chalk mb-6 leading-relaxed">
                                            {t('pricingNote')}
                                        </p>
                                        <ul className="space-y-3 mb-8">
                                            {Array.from({ length: item.itemCount }).map((_, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gelcoat/90">
                                                    <span className="w-2 h-2 rounded-full bg-teak"></span>
                                                    {t(`items.${item.id}.items.${i}`)}
                                                </li>
                                            ))}
                                        </ul>
                                        <ServiceButton
                                            serviceTitle={item.title}
                                            whatsappText={encodeURIComponent(tContact('defaultMessage', { service: item.title }))}
                                            buttonText={t('requestAppointment')}
                                            locale={locale}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 h-[400px] relative overflow-hidden shadow-xl">
                                        <ImageComparison
                                            imageBefore={item.imageBefore}
                                            imageAfter={item.imageAfter}
                                            alt={t(`items.${item.id}.description`)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            ))}
            <Footer locale={locale} />
        </main>
    );
}
