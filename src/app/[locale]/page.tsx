import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  // Await the params to get the locale
  const { locale } = await params;

  return (
    <main className="flex min-h-screen flex-col">
      <Navigation locale={locale} />
      <Hero />
      <Stats />

      {/* Placeholder for other sections */}
      <div id="fleet" className="h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Yacht Fleet Section Coming Soon...</p>
      </div>

      <Footer locale={locale} />
    </main>
  );
}
