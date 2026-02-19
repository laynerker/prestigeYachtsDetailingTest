import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'About' });

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Navigation locale={locale} />
            <PageHeader title={t('title')} imageSrc="/assets/images/hero.png" />

            <section className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-8">{t('title')}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        {t('p1')}
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        {t('p2')}
                    </p>
                </div>

                <div className="relative p-10 bg-navy text-white rounded-lg shadow-xl text-center">
                    <blockquote className="text-2xl font-serif italic mb-6">
                        "{t('quote')}"
                    </blockquote>
                </div>
            </section>

            <Footer locale={locale} />
        </main>
    );
}
