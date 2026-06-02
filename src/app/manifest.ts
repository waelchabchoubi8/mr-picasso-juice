import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Soltana Pro Max — La Tradition en Conserve',
    short_name: 'Soltana',
    description: 'Plats tunisiens traditionnels en conserve : mloukhiya, chakchouka, ojja… Composez votre coffret et faites-vous livrer partout en Tunisie.',
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFBF5',
    theme_color: '#CE2029',
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
