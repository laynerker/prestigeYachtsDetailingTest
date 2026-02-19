import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { setRequestLocale } from 'next-intl/server';

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Navigation locale={locale} />
            <PageHeader title="About Prestige Yachts" imageSrc="/assets/images/hero.png" />

            <section className="container mx-auto px-4 py-20 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-8">Welcome to Prestige Yachts Detailing</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        At Prestige Yachts Detailing, we&apos;re redefining luxury yacht rentals in Miami. As a passionate new player in the maritime industry, we bring fresh energy, unwavering dedication, and an obsessive attention to detail to every voyage we facilitate.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Our mission is simple yet ambitious: to exceed your expectations at every turn. We understand that renting a yacht isn&apos;t just about transportation—it&apos;s about creating unforgettable memories, celebrating life&apos;s special moments, and experiencing the freedom of the open sea in absolute comfort and style.
                    </p>
                </div>

                <div className="relative p-10 bg-navy text-white rounded-lg shadow-xl text-center">
                    <blockquote className="text-2xl font-serif italic mb-6">
                        "Your satisfaction isn&apos;t just our goal—it&apos;s our promise."
                    </blockquote>
                </div>
            </section>

            <Footer locale={locale} />
        </main>
    );
}
