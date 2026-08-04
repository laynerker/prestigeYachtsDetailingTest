import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Phone, Mail, MapPin } from 'lucide-react';

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Contact');

    return (
        <main className="flex min-h-screen flex-col">
            <Navigation locale={locale} />

            <section className="bg-slipway pt-40 pb-16 px-4 text-center">
                <h1 className="text-heading-1 text-gelcoat">{t('headerTitle')}</h1>
            </section>

            <section className="bg-gelcoat">
                <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="w-full lg:w-3/5">
                        <h2 className="text-3xl font-serif font-bold text-navy mb-8">Send Us a Message</h2>
                        <ContactForm />
                    </div>

                    <div className="w-full lg:w-2/5">
                        <h2 className="text-3xl font-serif font-bold text-navy mb-8">Contact Information</h2>
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-gold shadow-sm shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-sm uppercase text-gray-500 font-bold tracking-wider mb-1">Phone</span>
                                    <a href="tel:+19548534995" className="block text-base md:text-xl text-navy hover:text-gold transition-colors font-medium break-words">+1 (954) 853-4995</a>
                                    <p className="text-sm text-gray-400 mt-1">Mon-Sun, 9am - 8pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-gold shadow-sm shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-sm uppercase text-gray-500 font-bold tracking-wider mb-1">Email</span>
                                    <a href="mailto:contact@prestigeyachtsdetailing.com" className="block text-base md:text-xl text-navy hover:text-gold transition-colors font-medium break-words">contact@prestigeyachtsdetailing.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-gold shadow-sm shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block text-sm uppercase text-gray-500 font-bold tracking-wider mb-1">Location</span>
                                    <p className="text-base md:text-xl text-navy font-medium break-words">South Florida</p>
                                    <p className="text-sm md:text-base text-gray-500 mt-1">Miami, Miami Beach, Fort Lauderdale</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Embed */}
                        <div className="mt-8 h-64 md:h-80 bg-gray-100 rounded-xl overflow-hidden shadow-sm relative">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13964.533865406289!2d-80.12201463329555!3d26.13426408042312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9002ea87dbcc9%3A0x1e271fa5a8b50f54!2sFort%20Lauderdale%20Beach!5e0!3m2!1ses-419!2sar!4v1774149216035!5m2!1ses-419!2sar" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full border-0"
                            />
                        </div>
                    </div>
                </div>
                </div>
            </section>

            <Footer locale={locale} />
        </main>
    );
}
