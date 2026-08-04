import { setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedServices from '@/components/FeaturedServices';
import RecentWork from '@/components/RecentWork';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // Await the params to get the locale
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col bg-slipway">
      <Navigation locale={locale} />
      <Hero />
      <FeaturedServices />
      <RecentWork />
      <Footer locale={locale} />
    </main>
  );
}
