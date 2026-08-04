'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function FeaturedServices() {
    const locale = useLocale();
    const t = useTranslations('Home');

    return (
        <section className="py-24 bg-gelcoat relative border-y border-white/5 overflow-hidden">
            {/* Background elements for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-gelcoat via-white to-gelcoat pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-[1px] w-12 bg-teak/40"></span>
                            <p className="text-teak tracking-[0.3em] text-xs font-semibold uppercase">{t('featuredEyebrow')}</p>
                        </div>
                        <h2 className="text-heading-1 text-slipway mb-6">
                            {t('inviteTitle')}
                        </h2>
                        <p className="text-slipway/70 text-lg leading-relaxed mb-10">
                            {t('inviteText')}
                        </p>
                        <Link
                            href={`/${locale}/services`}
                            className="inline-flex items-center justify-center px-8 py-4 border border-teak/40 text-teak hover:bg-teak hover:text-slipway transition-all duration-300 tracking-wider text-sm font-semibold uppercase group rounded-sm"
                        >
                            {t('inviteCta')}
                        </Link>
                    </motion.div>

                    {/* Video Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        {/* 9:16 Aspect Ratio container for YouTube Short */}
                        <div className="relative w-full max-w-[360px] aspect-[9/16] bg-[#0a1526] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5 group-hover:ring-teak/40 transition-all duration-700 overflow-hidden">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
                            <div className="absolute inset-4 border border-white/5 group-hover:border-teak/40 transition-colors duration-700 z-20 pointer-events-none" />

                            <iframe 
                                src="https://www.youtube.com/embed/1fyk84tJx-M?autoplay=1&mute=1&loop=1&playlist=1fyk84tJx-M&controls=0&rel=0&showinfo=0&modestbranding=1" 
                                title="Prestige Yachts Detailing Short"
                                className="absolute inset-0 w-full h-full border-0 object-cover"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                            ></iframe>

                            {/* Decorative corners */}
                            <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-teak/0 group-hover:border-teak/60 transition-colors duration-700 z-20 pointer-events-none" />
                            <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-teak/0 group-hover:border-teak/60 transition-colors duration-700 z-20 pointer-events-none" />
                            <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-teak/0 group-hover:border-teak/60 transition-colors duration-700 z-20 pointer-events-none" />
                            <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-teak/0 group-hover:border-teak/60 transition-colors duration-700 z-20 pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
