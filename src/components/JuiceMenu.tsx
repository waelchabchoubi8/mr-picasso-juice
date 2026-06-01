'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

// ─── Format icons ────────────────────────────────────────────────────────────

function BottleIcon({ color, juiceColor }: { color: string; juiceColor: string }) {
  return (
    <svg viewBox="0 0 80 160" className="w-full h-full" fill="none">
      {/* Neck */}
      <rect x="28" y="6"  width="24" height="34" rx="6" fill={`${color}22`} stroke={color} strokeWidth="2" />
      {/* Cap */}
      <rect x="30" y="2"  width="20" height="10" rx="4" fill={color} />
      {/* Body */}
      <path d="M14 44 C14 40 26 38 28 38 L28 38 L52 38 C54 38 66 40 66 44 L66 146 C66 152 60 156 40 156 C20 156 14 152 14 146 Z" fill={`${juiceColor}18`} stroke={color} strokeWidth="2" />
      {/* Liquid fill */}
      <clipPath id={`bc-${color.replace('#','')}`}>
        <path d="M15 44 C15 41 27 39 28 39 L52 39 C53 39 65 41 65 44 L65 146 C65 151 59 155 40 155 C21 155 15 151 15 146 Z" />
      </clipPath>
      <rect x="14" y="70" width="52" height="86" fill={juiceColor} clipPath={`url(#bc-${color.replace('#','')})`} opacity="0.85" />
      {/* Shine */}
      <rect x="22" y="55" width="6" height="60" rx="3" fill="white" opacity="0.3" />
      {/* Label band */}
      <rect x="18" y="90" width="44" height="30" rx="4" fill="white" opacity="0.25" />
    </svg>
  );
}

function GrandCupIcon({ color, juiceColor }: { color: string; juiceColor: string }) {
  return (
    <svg viewBox="0 0 80 90" className="w-full h-full" fill="none">
      {/* Cup body */}
      <path d="M12 10 L16 80 C16 84 20 86 40 86 C60 86 64 84 64 80 L68 10 Z" fill={`${juiceColor}18`} stroke={color} strokeWidth="2" />
      {/* Liquid */}
      <clipPath id={`gc-${color.replace('#','')}`}>
        <path d="M13 10 L17 80 C17 83 21 85 40 85 C59 85 63 83 63 80 L67 10 Z" />
      </clipPath>
      <rect x="12" y="32" width="56" height="54" fill={juiceColor} clipPath={`url(#gc-${color.replace('#','')})`} opacity="0.85" />
      {/* Lid */}
      <ellipse cx="40" cy="10" rx="28" ry="5" fill={color} />
      {/* Straw */}
      <rect x="50" y="-2" width="5" height="50" rx="2.5" fill={color} transform="rotate(6,52,24)" />
      {/* Shine */}
      <rect x="19" y="18" width="5" height="40" rx="2.5" fill="white" opacity="0.3" />
    </svg>
  );
}

function PetitCupIcon({ color, juiceColor }: { color: string; juiceColor: string }) {
  return (
    <svg viewBox="0 0 70 70" className="w-full h-full" fill="none">
      {/* Cup */}
      <path d="M14 12 L18 58 C18 62 22 64 35 64 C48 64 52 62 52 58 L56 12 Z" fill={`${juiceColor}18`} stroke={color} strokeWidth="2" />
      {/* Liquid */}
      <clipPath id={`pc-${color.replace('#','')}`}>
        <path d="M15 12 L19 58 C19 61 23 63 35 63 C47 63 51 61 51 58 L55 12 Z" />
      </clipPath>
      <rect x="14" y="30" width="42" height="34" fill={juiceColor} clipPath={`url(#pc-${color.replace('#','')})`} opacity="0.85" />
      {/* Lid */}
      <ellipse cx="35" cy="12" rx="21" ry="4" fill={color} />
      {/* Straw */}
      <rect x="40" y="2" width="4" height="36" rx="2" fill={color} transform="rotate(5,42,20)" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATALOGUE = [
  {
    id:         'bouteille' as const,
    label:      'Bouteille',
    sub:        '1 Litre',
    color:      '#FF5A1F',
    juiceColor: '#FF7A45',
    bg:         '#FFF2ED',
    border:     '#FF5A1F33',
    items: [
      { name: 'Orange Soleil',     desc: '100 % oranges fraîchement pressées',     price: '12.000' },
      { name: 'Tropical Paradise', desc: 'Ananas, mangue, citron vert, gingembre', price: '13.500' },
      { name: 'Green Boost',       desc: 'Pomme verte, épinard, concombre, citron', price: '14.000' },
      { name: 'Sunrise Blend',     desc: 'Mangue, maracuja, orange sanguine',      price: '13.500' },
    ],
  },
  {
    id:         'grand' as const,
    label:      'Grand Cup',
    sub:        '500 ml',
    color:      '#E6A800',
    juiceColor: '#FFD34E',
    bg:         '#FFFBEC',
    border:     '#FFD34E55',
    items: [
      { name: 'Sunrise Mango',  desc: 'Mangue, orange, curcuma doré',             price: '7.500' },
      { name: 'Berry Blast',    desc: 'Fraise, framboise, betterave, pomme',       price: '7.500' },
      { name: 'Citrus Storm',   desc: 'Orange sanguine, pamplemousse, basilic',    price: '7.000' },
      { name: 'Tropic Thunder', desc: 'Ananas, citron vert, menthe fraîche',       price: '7.500' },
    ],
  },
  {
    id:         'petit' as const,
    label:      'Petit Cup',
    sub:        '250 ml',
    color:      '#18A88A',
    juiceColor: '#3ECFB0',
    bg:         '#F0FDFB',
    border:     '#3ECFB044',
    items: [
      { name: 'Classic Orange',  desc: 'Oranges de saison, fraîcheur garantie',         price: '4.500' },
      { name: 'Pomme Gingembre', desc: 'Pomme verte, gingembre frais, citron',          price: '5.000' },
      { name: 'Menthe Citron',   desc: 'Citron pressé, menthe fraîche, eau pétillante', price: '4.500' },
      { name: 'Ananas Coco',     desc: 'Ananas, eau de coco, citron vert',              price: '5.000' },
    ],
  },
];

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1];

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JuiceMenu() {
  const t = useTranslations('menu');
  const [active, setActive] = useState<'bouteille' | 'grand' | 'petit'>('bouteille');
  const current = CATALOGUE.find(c => c.id === active)!;

  return (
    <section id="menu" className="py-16 lg:py-28 px-4 sm:px-6 bg-[#FFFBF5]/95">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: SPRING }}
          className="text-center mb-14"
        >
          <span className="inline-block text-coral text-xs font-semibold tracking-[0.22em] uppercase mb-4">
            — Catalogue · Tunis —
          </span>
          <h2 className="font-playfair text-[clamp(2.2rem,5vw,3.8rem)] font-bold text-warm leading-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-warm/50 text-lg max-w-sm mx-auto">{t('subtitle')}</p>
        </motion.div>

        {/* Format tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2 bg-white border border-warm/10 rounded-full p-1.5 shadow-sm">
            {CATALOGUE.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className="relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer"
                style={active === cat.id
                  ? { background: cat.color, color: '#fff', boxShadow: `0 4px 16px ${cat.color}40` }
                  : { color: '#1A0A0088' }}
              >
                <span className="block leading-tight">{cat.label}</span>
                <span className="block text-[10px] font-normal opacity-75">{cat.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: SPRING }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {current.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.42, ease: SPRING }}
                whileHover={{ y: -5, boxShadow: `0 14px 36px ${current.color}20` }}
                className="group flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300"
                style={{ background: current.bg, borderColor: current.border }}
              >
                {/* Product illustration */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden p-1"
                  style={{ background: `${current.color}12` }}
                >
                  {active === 'bouteille' && <BottleIcon color={current.color} juiceColor={current.juiceColor} />}
                  {active === 'grand'     && <GrandCupIcon color={current.color} juiceColor={current.juiceColor} />}
                  {active === 'petit'     && <PetitCupIcon color={current.color} juiceColor={current.juiceColor} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-warm text-[15px] leading-tight mb-0.5">{item.name}</p>
                  <p className="text-warm/40 text-xs leading-relaxed line-clamp-2">{item.desc}</p>
                </div>

                {/* Price + add */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <span className="font-playfair font-bold text-warm text-sm whitespace-nowrap">
                    {item.price} <span className="text-warm/50 text-xs font-normal">TND</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    style={{ background: current.color }}
                    aria-label={`Ajouter ${item.name}`}
                  >
                    <PlusIcon />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-center"
        >
          {[
            { label: 'Pressé à la commande' },
            { label: 'Sans additifs' },
            { label: 'Servi frais · Tunis' },
          ].map(({ label }) => (
            <div key={label} className="flex items-center gap-2 text-warm/35 text-sm">
              <span className="w-1 h-1 rounded-full bg-coral/50 inline-block" />
              {label}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
