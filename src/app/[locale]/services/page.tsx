import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import { setRequestLocale } from 'next-intl/server';

export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Navigation locale={locale} />
            <PageHeader title="Enhance Your Experience" imageSrc="/assets/images/hero.png" />

            <section className="container mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
                    <div className="w-full md:w-1/2 h-[400px] bg-gray-200 rounded-lg relative overflow-hidden">
                        {/* Catering Image */}
                        <div className="absolute inset-0 bg-navy/10 flex items-center justify-center">Catering Image</div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl font-serif font-bold text-navy mb-6 border-b-2 border-gold inline-block pb-2">CATERING</h2>
                        <h3 className="text-2xl font-medium text-gray-800 mb-4">Prestige Yachts Detailing: Private Chef Catering at Sea</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Elevate your yacht experience with our exclusive private chef catering service. Our culinary team brings restaurant-quality dining directly to your vessel, crafting personalized menus tailored to your preferences.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {['Customized menus', 'Professional chefs', 'Fresh ingredients', 'Dietary accommodations'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-gray-700">
                                    <span className="w-2 h-2 rounded-full bg-gold"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="px-6 py-3 bg-navy text-white rounded hover:bg-gold transition-colors">Request Custom Menu</button>
                    </div>
                </div>
            </section>

            <Footer locale={locale} />
        </main>
    );
}
