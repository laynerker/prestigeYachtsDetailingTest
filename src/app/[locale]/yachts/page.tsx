import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { setRequestLocale } from 'next-intl/server';

export default async function Yachts({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Navigation locale={locale} />
            <PageHeader title="Our Luxury Fleet" imageSrc="/assets/images/hero.png" />

            <section className="container mx-auto px-4 py-20">
                <p className="text-center text-xl text-gray-600 max-w-2xl mx-auto mb-16">
                    Explore our exclusive collection of premium yachts. Each vessel is meticulously maintained and fully equipped to ensure your voyage is unforgettable.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder Yacht Cards */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="h-64 bg-gray-200 relative">
                                {/* In a real app, Image here */}
                                <div className="absolute inset-0 bg-navy/10 flex items-center justify-center text-gray-400">
                                    Yacht Image {i}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-serif font-bold text-navy mb-2">Sea Breeze {60 + i * 10}</h3>
                                <div className="flex justify-between text-sm text-gray-500 mb-4 uppercase tracking-wider">
                                    <span>{60 + i * 10} ft</span>
                                    <span>{10 + i * 5} Guests</span>
                                    <span>{2 + i} Cabins</span>
                                </div>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                    <span className="text-xl font-bold text-gold">${800 + i * 400}/hr</span>
                                    <button className="px-4 py-2 bg-navy text-white text-sm rounded-full hover:bg-gold transition-colors">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer locale={locale} />
        </main>
    );
}
