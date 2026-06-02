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
  title: 'Masmoudi — Pâtisserie d\'Exception',
  description: 'Pâtisserie tunisienne d\'exception depuis 1969. Baklawa, makroud, mlabes — composez votre coffret, livré partout en Tunisie.',
  applicationName: 'Masmoudi',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Masmoudi',
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
    title: 'Masmoudi — Pâtisserie d\'Exception',
    description: 'La pâtisserie tunisienne d\'exception depuis 1969. Composez votre coffret de baklawa, makroud et mlabes.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#6C5CE7',
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
