import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { CustomCursor } from '@/components/CustomCursor';
import { FruitBackground } from '@/components/FruitBackground';
import { CartProvider } from '@/components/CartContext';
import CartDrawer from '@/components/CartDrawer';
import '../globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mr. Picasso Juice — L\'Art du Jus Frais',
  description: 'Premium artisanal juice store. Every glass is a masterpiece.',
  openGraph: {
    title: 'Mr. Picasso Juice',
    description: 'Premium artisanal juice — pressed to order, crafted with passion.',
    type: 'website',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages   = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#FFFBF5] text-warm overflow-x-hidden">
        <CustomCursor />
        <FruitBackground />

        <CartProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <CartDrawer />
          </NextIntlClientProvider>
        </CartProvider>
      </body>
    </html>
  );
}
