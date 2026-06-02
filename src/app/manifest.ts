import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Masmoudi — Pâtisserie d\'Exception',
    short_name: 'Masmoudi',
    description: 'Pâtisserie tunisienne d\'exception depuis 1969. Composez votre coffret et faites-vous livrer partout en Tunisie.',
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFBF5',
    theme_color: '#6C5CE7',
    lang: 'fr',
    categories: ['food', 'shopping', 'lifestyle'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
