'use client';

import { motion } from 'framer-motion';

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1];

const VALUES = [
  {
    title: 'Fraîcheur',
    desc: 'Chaque pièce est façonnée à la main dans notre atelier de Sfax, fraîche chaque jour.',
    color: '#6C5CE7',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M20 2v4h-4"/>
      </svg>
    ),
  },
  {
    title: 'Naturalité',
    desc: 'Pistache d\'Alep, amandes, miel pur — uniquement des ingrédients nobles, sans artifice.',
    color: '#7ED95A',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
  },
  {
    title: 'Tradition',
    desc: 'De la baklawa au makroud, un savoir-faire artisanal transmis depuis 1969.',
    color: '#FFD34E',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
  },
];

const STATS = [
  { value: '1969', label: 'Fondé à Sfax' },
  { value: '50+',  label: 'Pâtisseries' },
  { value: '100%', label: 'Fait main' },
  { value: '∞',    label: 'Coffrets possibles' },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-28 px-4 sm:px-6 bg-[#FFF8F0]/95">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: SPRING }}
          >
            <span className="inline-block text-coral text-xs font-semibold tracking-[0.22em] uppercase mb-4">
              — Notre Histoire —
            </span>
            <h2 className="font-playfair text-[clamp(2.2rem,5vw,3.8rem)] font-bold text-warm leading-tight mb-6">
              Né à Sfax,<br />
              <span className="italic text-coral">fait avec passion</span>
            </h2>
            <p className="text-warm/60 text-lg leading-relaxed mb-4">
              Masmoudi est née en 1969 à Sfax, d&apos;une passion pour la pâtisserie tunisienne d&apos;exception.
            </p>
            <p className="text-warm/55 text-base leading-relaxed">
              Depuis, nous perpétuons un savoir-faire artisanal : baklawa au miel, makroud aux dattes, mlabes à la pistache d&apos;Alep. Chaque pièce est une œuvre, façonnée à la main.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: SPRING }}
            className="grid grid-cols-2 gap-5"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, ease: SPRING }}
                className="bg-white border border-warm/8 rounded-3xl p-6 shadow-sm"
              >
                <p className="font-playfair text-4xl font-bold text-coral leading-tight">{s.value}</p>
                <p className="text-warm/50 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: SPRING }}
          className="text-center mb-12"
        >
          <h3 className="font-playfair text-3xl font-bold text-warm">Nos Engagements</h3>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: SPRING }}
              className="bg-white border border-warm/8 rounded-3xl p-7 shadow-sm group hover:shadow-md transition-shadow duration-300"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-white"
                style={{ background: v.color, boxShadow: `0 4px 16px ${v.color}40` }}
              >
                {v.icon}
              </div>
              <h4 className="font-playfair text-xl font-bold text-warm mb-2">{v.title}</h4>
              <p className="text-warm/55 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
