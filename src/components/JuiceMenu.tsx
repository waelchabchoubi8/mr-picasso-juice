'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCart } from './CartContext';
import { useCurrency } from './CurrencyContext';

// ─── Tin / jar illustration (coloured by the dish inside) ──────────────────────

function TinCanIcon({ accent, food }: { accent: string; food: string }) {
  const clip = `tin-${accent.replace('#', '')}-${food.replace('#', '')}`;
  return (
    <svg viewBox="0 0 80 96" className="w-full h-full" fill="none">
      {/* body outline */}
      <path d="M16 22 L16 80 C16 88 24 92 40 92 C56 92 64 88 64 80 L64 22 Z"
        fill="white" fillOpacity="0.3" stroke={accent} strokeWidth="2" />
      {/* content fill */}
      <clipPath id={clip}>
        <path d="M16 22 L16 80 C16 88 24 92 40 92 C56 92 64 88 64 80 L64 22 Z" />
      </clipPath>
      <rect x="16" y="40" width="48" height="52" fill={food} opacity="0.85" clipPath={`url(#${clip})`} />
      {/* lid */}
      <ellipse cx="40" cy="22" rx="24" ry="7" fill={accent} />
      <ellipse cx="40" cy="22" rx="18" ry="4" fill="white" opacity="0.25" />
      {/* label band */}
      <rect x="20" y="52" width="40" height="22" rx="3" fill="white" opacity="0.3" />
      {/* shine */}
      <rect x="24" y="34" width="4" height="44" rx="2" fill="white" opacity="0.28" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATALOGUE = [
  {
    id:     'mijotes' as const,
    label:  'Plats Mijotés',
    sub:    'Conserves',
    color:  '#CE2029',
    bg:     '#FFF2ED',
    border: '#CE202933',
    items: [
      { name: 'Mloukhiya',     desc: 'Feuilles de corète mijotées au bœuf, huile d\'olive', price: '9.500',  food: '#2E5E3A', size: '800 g' },
      { name: 'Kleya',         desc: 'Foie et cœur sautés aux poivrons et épices',          price: '10.000', food: '#7A3B28', size: '600 g' },
      { name: 'Marqa Hloua',   desc: 'Ragoût sucré-salé aux coings et viande tendre',       price: '9.000',  food: '#A33B26', size: '800 g' },
      { name: 'Ojja Merguez',  desc: 'Tomates, poivrons, œufs et merguez épicée',           price: '8.500',  food: '#E2542E', size: '600 g' },
    ],
  },
  {
    id:     'legumes' as const,
    label:  'Légumes & Tartinables',
    sub:    'Bocaux',
    color:  '#18A88A',
    bg:     '#F0FDFB',
    border: '#3ECFB044',
    items: [
      { name: 'Chakchouka',      desc: 'Poivrons, tomates et oignons confits doucement', price: '7.000', food: '#D9482B', size: '350 g' },
      { name: 'Slata Méchouia',  desc: 'Légumes grillés, ail et huile d\'olive',          price: '7.500', food: '#6E8B3D', size: '350 g' },
      { name: 'Kafteji',         desc: 'Légumes frits et hachés, piment doux',           price: '7.000', food: '#D17A2A', size: '350 g' },
      { name: 'Harissa Maison',  desc: 'Piments rouges, ail, carvi et coriandre',        price: '5.500', food: '#C42A1C', size: '200 g' },
    ],
  },
  {
    id:     'classiques' as const,
    label:  'Les Classiques',
    sub:    'Prêts à servir',
    color:  '#E6A800',
    bg:     '#FFFBEC',
    border: '#FFD34E55',
    items: [
      { name: 'Couscous Légumes', desc: 'Semoule roulée à la main, légumes de saison', price: '8.000', food: '#E0A92E', size: '800 g' },
      { name: 'Lablabi',          desc: 'Soupe de pois chiches, cumin et harissa',      price: '6.500', food: '#C9A86A', size: '500 g' },
      { name: 'Tajine Tunisien',  desc: 'Gratin d\'œufs, fromage et persil frais',      price: '8.500', food: '#C98A3A', size: '500 g' },
      { name: 'Doigts de Fatma',  desc: 'Briks croustillants farcis (×6)',              price: '7.500', food: '#E3B23C', size: '×6' },
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
  const { amount, symbol } = useCurrency();
  const [active, setActive] = useState<CatId>('mijotes');
  const [addedId, setAddedId] = useState<string | null>(null);
  const current = CATALOGUE.find(c => c.id === active)!;

  const handleAdd = (item: { name: string; desc: string; price: string; food: string; size: string }) => {
    const id = `${active}-${item.name}`;
    addItem({
      id,
      name:   item.name,
      format: `Conserve · ${item.size}`,
      price:  parseFloat(item.price.replace(',', '.')),
      color:  item.food,
    });
    setAddedId(id);
    setTimeout(() => setAddedId(id => (id === `${active}-${item.name}` ? null : id)), 1200);
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
                {/* Tin illustration */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden p-1"
                  style={{ background: `${current.color}12` }}
                >
                  <TinCanIcon accent={current.color} food={item.food} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-warm text-[15px] leading-tight mb-0.5">{item.name}</p>
                  <p className="text-warm/40 text-xs leading-relaxed line-clamp-2">{item.desc}</p>
                </div>

                {/* Price + add */}
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <span className="font-playfair font-bold text-warm text-sm whitespace-nowrap">
                    {amount(parseFloat(item.price))} <span className="text-warm/50 text-xs font-normal">{symbol}</span>
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
            { label: 'Recettes traditionnelles' },
            { label: 'Sans conservateurs' },
            { label: 'Fait main · Sfax' },
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
