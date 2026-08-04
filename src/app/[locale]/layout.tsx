import type { Metadata } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from "next/navigation";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700"],
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

// ...existing code...
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export const metadata: Metadata = {
  title: "Prestige Yachts Detailing",
  description: "Luxury Yacht Rentals in Miami",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'es'].includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${archivo.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased text-foreground bg-background min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
