'use client';

import { motion } from 'framer-motion';

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1];

const REVIEWS = [
  {
    name: 'Sarra B.',
    city: 'Sfax',
    rating: 5,
    text: 'La mloukhiya Soltana a le goût de celle de ma grand-mère. Mijotée comme il faut — un vrai régal !',
    fruit: '🫙',
  },
  {
    name: 'Ahmed K.',
    city: 'Tunis',
    rating: 5,
    text: 'J\'ai commandé un grand coffret pour la famille : chakchouka, ojja, couscous… Tout était délicieux et bien emballé.',
    fruit: '🌶️',
  },
  {
    name: 'Fatma R.',
    city: 'Sousse',
    rating: 5,
    text: 'Le coffret personnalisé est une idée géniale ! J\'ai rempli mes conserves avec mes plats préférés. Pratique et savoureux.',
    fruit: '🍲',
  },
  {
    name: 'Youssef M.',
    city: 'Sfax',
    rating: 5,
    text: 'Qualité constante, livraison rapide partout en Tunisie. Soltana Pro Max, c\'est la tradition en conserve.',
    fruit: '🥘',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < count ? '#FFD34E' : 'none'}
          stroke={i < count ? '#FFD34E' : '#E8DDD4'} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 bg-[#FFFBF5]/95">
      <div className="max-w-6xl mx-auto px-0 sm:px-0">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: SPRING }}
          className="text-center mb-14"
        >
          <span className="inline-block text-coral text-xs font-semibold tracking-[0.22em] uppercase mb-4">
            — Ils nous font confiance —
          </span>
          <h2 className="font-playfair text-[clamp(2rem,4.5vw,3.5rem)] font-bold text-warm leading-tight">
            Ce que disent nos clients
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: SPRING }}
              whileHover={{ y: -5 }}
              className="bg-white border border-warm/8 rounded-3xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-default"
            >
              {/* Top: stars + fruit emoji */}
              <div className="flex items-center justify-between">
                <Stars count={r.rating} />
                <span className="text-2xl" role="img" aria-hidden>{r.fruit}</span>
              </div>

              {/* Quote */}
              <p className="text-warm/65 text-sm leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-2 border-t border-warm/6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral/20 to-sunny/20 flex items-center justify-center">
                  <span className="text-warm/60 text-xs font-bold">{r.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-warm text-sm font-semibold leading-tight">{r.name}</p>
                  <p className="text-warm/40 text-xs">{r.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
