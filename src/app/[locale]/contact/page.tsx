import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';
import { setRequestLocale } from 'next-intl/server';
import { Phone, Mail, MapPin } from 'lucide-react';

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="flex min-h-screen flex-col bg-white">
            <Navigation locale={locale} />
            <PageHeader title="Get In Touch" imageSrc="/assets/images/hero.png" />

            <section className="container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="w-full lg:w-3/5">
                        <h2 className="text-3xl font-serif font-bold text-navy mb-8">Send Us a Message</h2>
                        <ContactForm />
                    </div>

                    <div className="w-full lg:w-2/5">
                        <h2 className="text-3xl font-serif font-bold text-navy mb-8">Contact Information</h2>
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-gold shadow-sm">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <span className="block text-sm uppercase text-gray-500 font-bold tracking-wider mb-1">Phone</span>
                                    <a href="tel:+19548534995" className="text-xl text-navy hover:text-gold transition-colors font-medium">+1 (954) 853-4995</a>
                                    <p className="text-sm text-gray-400 mt-1">Mon-Sun, 9am - 8pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-gold shadow-sm">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <span className="block text-sm uppercase text-gray-500 font-bold tracking-wider mb-1">Email</span>
                                    <a href="mailto:contact@prestigeyachtsdetailing.com" className="text-xl text-navy hover:text-gold transition-colors font-medium">contact@prestigeyachtsdetailing.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-gold shadow-sm">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <span className="block text-sm uppercase text-gray-500 font-bold tracking-wider mb-1">Location</span>
                                    <p className="text-xl text-navy font-medium">South Florida</p>
                                    <p className="text-gray-500">Miami, Miami Beach, Fort Lauderdale</p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder - In valid impl, Google Maps API goes here */}
                        <div className="mt-8 h-64 bg-gray-200 rounded-xl overflow-hidden relative shadow-inner">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold tracking-wider">
                                GOOGLE MAPS API
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer locale={locale} />
        </main>
    );
}
