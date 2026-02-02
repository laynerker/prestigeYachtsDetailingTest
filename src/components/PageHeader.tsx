'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PageHeader({ title, imageSrc }: { title: string, imageSrc: string }) {
    return (
        <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]" />
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-4xl md:text-6xl font-serif font-bold text-white text-center drop-shadow-xl px-4"
            >
                {title}
            </motion.h1>
        </section>
    );
}
