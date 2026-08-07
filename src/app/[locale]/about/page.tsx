import { getTranslations, setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'About' });

    return (
        <main className="flex min-h-screen flex-col">
            <Navigation locale={locale} />

            <PageHeader title={t('title')} />

            <section className="bg-gelcoat py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <p className="text-body text-slipway/80 text-lg leading-relaxed mb-6">
                        {t('p1')}
                    </p>
                    <p className="text-body text-slipway/80 text-lg leading-relaxed mb-6">
                        {t('p2')}
                    </p>
                </div>
            </section>

            <section className="bg-slipway py-20 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                    <blockquote className="text-heading-3 text-gelcoat italic">
                        &ldquo;{t('quote')}&rdquo;
                    </blockquote>
                </div>
            </section>

            <Footer locale={locale} />
        </main>
    );
}
