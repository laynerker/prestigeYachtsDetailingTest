import Image from 'next/image';

interface PageHeaderProps {
    title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
    return (
        <section className="relative pt-40 pb-16 px-4 text-center overflow-hidden bg-slipway">
            <div className="absolute inset-0">
                <Image
                    src="/assets/images/hero.png"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slipway/90 via-slipway/85 to-slipway" />
            </div>
            <div className="noise-overlay" />
            <h1 className="relative z-10 text-heading-1 text-teak">{title}</h1>
        </section>
    );
}
