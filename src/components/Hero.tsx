'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
    const t = useTranslations('Home');

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/images/hero.png"
                    alt="Luxury Yacht"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/20 to-navy/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-lg max-w-5xl leading-tight"
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl font-light tracking-wide drop-shadow-md"
                >
                    {t('subtitle')}
                </motion.p>

                <motion.a
                    href="#fleet"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="px-8 py-4 bg-white/10 border border-white/50 text-white font-medium uppercase tracking-widest hover:bg-white hover:text-navy transition-all rounded-full backdrop-blur-md"
                >
                    {t('cta')}
                </motion.a>
            </div>

            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
            </motion.div>
        </section>
    );
}
