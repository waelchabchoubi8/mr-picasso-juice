import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mr. Picasso Juice — L\'Art du Jus Frais',
    short_name: 'Picasso Juice',
    description: 'Jus artisanaux pressés à la commande. Réservez, commandez et faites-vous livrer à Sfax.',
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFBF5',
    theme_color: '#FF5A1F',
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
