'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCart } from './CartContext';

// ─── Pâtisserie illustration (baklawa diamond on a tray, tinted per item) ───────

function SweetIcon({ accent, food }: { accent: string; food: string }) {
  const clip = `sweet-${accent.replace('#', '')}-${food.replace('#', '')}`;
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
      {/* tray */}
      <ellipse cx="40" cy="60" rx="30" ry="9" fill={accent} opacity="0.15" />
      <ellipse cx="40" cy="58" rx="30" ry="9" fill="white" opacity="0.5" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" />
      {/* diamond piece */}
      <clipPath id={clip}>
        <path d="M40 14 L64 40 L40 60 L16 40 Z" />
      </clipPath>
      <path d="M40 14 L64 40 L40 60 L16 40 Z" fill={food} stroke={accent} strokeWidth="2" strokeOpacity="0.4" />
      {/* layered phyllo lines */}
      <g clipPath={`url(#${clip})`} opacity="0.35">
        <path d="M16 34 L64 34" stroke="white" strokeWidth="1.5" />
        <path d="M16 46 L64 46" stroke="white" strokeWidth="1.5" />
      </g>
      {/* pistachio centre */}
      <circle cx="40" cy="39" r="7" fill="#7FB23B" />
      <circle cx="40" cy="39" r="7" fill="white" opacity="0.18" />
      {/* shine */}
      <path d="M30 30 L40 20 L44 24 L34 34 Z" fill="white" opacity="0.25" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATALOGUE = [
  {
    id:     'baklawa' as const,
    label:  'Baklawa',
    sub:    'Au miel',
    color:  '#C9A24B',
    bg:     '#FBF6EA',
    border: '#C9A24B33',
    items: [
      { name: 'Baklawa Pistache',   desc: 'Feuilles de warka, pistache d\'Alep, sirop de miel',  price: '65.000', food: '#7FB23B', size: '500 g' },
      { name: 'Baklawa Amande',     desc: 'Amandes torréfiées, fleur d\'oranger, miel doré',      price: '60.000', food: '#C9A24B', size: '500 g' },
      { name: 'Baklawa Bourgeoise', desc: 'Assortiment fin de baklawas, recette de Sfax',         price: '68.000', food: '#B98B3A', size: '500 g' },
      { name: 'Baklawa Noix',       desc: 'Cerneaux de noix, cannelle, sirop parfumé',            price: '58.000', food: '#8A5A2C', size: '500 g' },
    ],
  },
  {
    id:     'pistache' as const,
    label:  'Pistache',
    sub:    'La gamme verte',
    color:  '#6FA53B',
    bg:     '#F3F8EA',
    border: '#7FB23B44',
    items: [
      { name: 'Mlabes Pistache',  desc: 'Pâte d\'amande et pistache, dragéifiée',          price: '62.900', food: '#BFE0A8', size: '500 g' },
      { name: 'Malfouf Pistache', desc: 'Roulé croustillant garni de pistache',            price: '65.000', food: '#6FA53B', size: '500 g' },
      { name: 'Libanais Pistache',desc: 'Bouchées libanaises, cœur de pistache',           price: '30.000', food: '#C9A24B', size: '500 g' },
      { name: 'Kaak Pistache',    desc: 'Anneaux fondants, glaçage à la pistache',         price: '55.000', food: '#9CCC65', size: '500 g' },
    ],
  },
  {
    id:     'coffrets' as const,
    label:  'Coffrets',
    sub:    'À offrir',
    color:  '#6C5CE7',
    bg:     '#F2F0FE',
    border: '#6C5CE733',
    items: [
      { name: 'Coffret Pistache 36 pièces', desc: 'Notre assortiment signature tout pistache',      price: '87.000',  food: '#7FB23B', size: '36 pcs' },
      { name: 'Sélection Tounsi',           desc: 'Le meilleur de la pâtisserie tunisienne, 1 kg',   price: '116.000', food: '#C9A24B', size: '1 kg' },
      { name: 'Assortiment Oriental',       desc: 'Baklawa, makroud, samsa & plus, 1 kg',            price: '95.000',  food: '#9A5A2C', size: '1 kg' },
      { name: 'Carte Cadeaux',              desc: 'Offrez Masmoudi — montant au choix',              price: '50.000',  food: '#6C5CE7', size: 'Cadeau' },
    ],
  },
];

type CatId = (typeof CATALOGUE)[number]['id'];

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1];

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JuiceMenu() {
  const t = useTranslations('menu');
  const { addItem } = useCart();
  const [active, setActive] = useState<CatId>('baklawa');
  const [addedId, setAddedId] = useState<string | null>(null);
  const current = CATALOGUE.find(c => c.id === active)!;

  const handleAdd = (item: { name: string; desc: string; price: string; food: string; size: string }) => {
    const id = `${active}-${item.name}`;
    addItem({
      id,
      name:   item.name,
      format: `${current.label} · ${item.size}`,
      price:  parseFloat(item.price.replace(',', '.')),
      color:  item.food,
    });
    setAddedId(id);
    setTimeout(() => setAddedId(cur => (cur === `${active}-${item.name}` ? null : cur)), 1200);
  };

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
            — Catalogue · Sfax —
          </span>
          <h2 className="font-playfair text-[clamp(2.2rem,5vw,3.8rem)] font-bold text-warm leading-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-warm/50 text-lg max-w-sm mx-auto">{t('subtitle')}</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2 bg-white border border-warm/10 rounded-full p-1.5 shadow-sm">
            {CATALOGUE.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className="relative px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer"
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
                {/* Pastry illustration */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden p-1"
                  style={{ background: `${current.color}12` }}
                >
                  <SweetIcon accent={current.color} food={item.food} />
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
                    onClick={e => { e.stopPropagation(); handleAdd(item); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    style={{ background: addedId === `${active}-${item.name}` ? '#22c55e' : current.color }}
                    aria-label={`Ajouter ${item.name}`}
                  >
                    {addedId === `${active}-${item.name}` ? <CheckIcon /> : <PlusIcon />}
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
            { label: 'Pâtisserie artisanale' },
            { label: 'Pistache d\'Alep' },
            { label: 'Fait à Sfax depuis 1969' },
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
