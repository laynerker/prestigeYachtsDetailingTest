'use client';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const CountUp = ({ end, duration = 2 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            const percentage = Math.min(progress / (duration * 1000), 1);

            setCount(Math.floor(end * percentage));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(updateCount);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isInView]);

    return <span ref={nodeRef}>{count}</span>;
}

export default function Stats() {
    const t = useTranslations('Home.stats');

    const stats = [
        { key: 'yachts', value: 12, suffix: '' },
        { key: 'clients', value: 150, suffix: '+' },
        { key: 'voyages', value: 500, suffix: '+' },
    ];

    return (
        <section className="py-24 bg-white text-navy relative z-20 -mt-8 rounded-t-3xl shadow-2xl mx-4 md:mx-0 md:rounded-none md:mt-0 md:shadow-none">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {stats.map((stat) => (
                        <div key={stat.key} className="p-8">
                            <div className="text-6xl font-bold font-serif text-navy mb-4">
                                <CountUp end={stat.value} />{stat.suffix}
                            </div>
                            <p className="text-gray-400 uppercase tracking-widest text-sm font-medium">{t(stat.key)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
