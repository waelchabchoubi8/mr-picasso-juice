import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { CustomCursor } from '@/components/CustomCursor';
import { FruitBackground } from '@/components/FruitBackground';
import { CartProvider } from '@/components/CartContext';
import CartDrawer from '@/components/CartDrawer';
import { InstallPWA } from '@/components/InstallPWA';
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
  applicationName: 'Mr. Picasso Juice',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Picasso Juice',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Mr. Picasso Juice',
    description: 'Premium artisanal juice — pressed to order, crafted with passion.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FF5A1F',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
            <InstallPWA />
          </NextIntlClientProvider>
        </CartProvider>
      </body>
    </html>
  );
}
