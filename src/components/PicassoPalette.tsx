'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCart } from './CartContext';

const PALETTE_PRICE = 7.5;

// ─── Animated Bottle SVG ──────────────────────────────────────────────────────

interface BottleFillProps {
  colors: string[];
  fillPercent: number; // 0–100
}

function AnimatedBottle({ colors, fillPercent }: BottleFillProps) {
  // Body occupies y=62 → y=188 in the viewBox (126px tall)
  const bodyTop    = 62;
  const bodyBottom = 188;
  const bodyHeight = bodyBottom - bodyTop;
  const fillH      = (fillPercent / 100) * bodyHeight;
  const fillY      = bodyBottom - fillH;

  // Build gradient stops from selected fruit colors
  const gradientId = 'bottle-fill-grad';

  return (
    <svg viewBox="0 0 100 200" className="w-28 h-56 drop-shadow-lg" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          {colors.length === 0 ? (
            <stop offset="100%" stopColor="#e0e0e0" stopOpacity="0.3" />
          ) : colors.map((c, i) => (
            <stop
              key={i}
              offset={`${(i / Math.max(colors.length - 1, 1)) * 100}%`}
              stopColor={c}
            />
          ))}
        </linearGradient>

        {/* Clip to inner bottle body */}
        <clipPath id="body-clip">
          <path d="M18 62 C18 58 30 56 32 56 L68 56 C70 56 82 58 82 62 L82 180 C82 188 70 194 50 194 C30 194 18 188 18 180 Z" />
        </clipPath>

        {/* Clip to neck */}
        <clipPath id="neck-clip">
          <rect x="36" y="8" width="28" height="48" rx="6" />
        </clipPath>
      </defs>

      {/* ── Neck ── */}
      <rect x="36" y="8"  width="28" height="48" rx="6"
        fill="#ffffff" stroke="#E0D5C8" strokeWidth="1.5" />
      {/* Neck liquid (fills when full) */}
      <motion.rect
        x="37" y="8" width="26"
        animate={{ height: fillPercent > 85 ? 48 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        rx="5"
        fill={`url(#${gradientId})`}
        opacity="0.85"
        clipPath="url(#neck-clip)"
      />

      {/* ── Cap ── */}
      <rect x="38" y="2" width="24" height="12" rx="5" fill={colors[0] ?? '#E0D5C8'} />
      <rect x="40" y="2" width="8"  height="12" rx="3" fill="white" opacity="0.2" />

      {/* ── Body outline ── */}
      <path
        d="M18 62 C18 58 30 56 32 56 L68 56 C70 56 82 58 82 62 L82 180 C82 188 70 194 50 194 C30 194 18 188 18 180 Z"
        fill="white"
        fillOpacity="0.3"
        stroke="#E0D5C8"
        strokeWidth="1.5"
      />

      {/* ── Liquid fill (animated) ── */}
      <motion.rect
        x="18"
        width="64"
        animate={{ y: fillY, height: fillH }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        fill={`url(#${gradientId})`}
        opacity="0.88"
        clipPath="url(#body-clip)"
      />

      {/* ── Liquid surface wave — y-translate avoids d-morph jank ── */}
      {fillPercent > 2 && (
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          clipPath="url(#body-clip)"
        >
          <path
            d={`M18 ${fillY} Q34 ${fillY - 2} 50 ${fillY} Q66 ${fillY + 2} 82 ${fillY}`}
            stroke={colors[0] ?? '#E0D5C8'}
            strokeWidth="1.5"
            fill="none"
            opacity="0.55"
          />
        </motion.g>
      )}

      {/* ── Shine streaks ── */}
      <rect x="26" y="70" width="6" height="90" rx="3" fill="white" opacity="0.18" />
      <rect x="34" y="70" width="3" height="60" rx="1.5" fill="white" opacity="0.1" />

      {/* ── Label zone ── */}
      <rect x="24" y="100" width="52" height="42" rx="6"
        fill="white" fillOpacity="0.22"
        stroke="white" strokeWidth="0.5" strokeOpacity="0.4" />

      {/* ── Empty indicator ── */}
      {fillPercent === 0 && (
        <text x="50" y="145" textAnchor="middle" fontSize="9" fill="#C0B8B0" fontFamily="serif">
          Sélectionner
        </text>
      )}
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FRUITS = [
  { id: 'mango',       name: 'Mangue',      color: '#FF8C42', letter: 'M'  },
  { id: 'orange',      name: 'Orange',      color: '#FF5A1F', letter: 'O'  },
  { id: 'lime',        name: 'Citron Vert', color: '#7ED95A', letter: 'C'  },
  { id: 'strawberry',  name: 'Fraise',      color: '#FF5B7A', letter: 'F'  },
  { id: 'pineapple',   name: 'Ananas',      color: '#FFD34E', letter: 'A'  },
  { id: 'dragonfruit', name: 'Pitaya',      color: '#D966C4', letter: 'P'  },
  { id: 'blueberry',   name: 'Myrtille',    color: '#7B8FF5', letter: 'My' },
  { id: 'watermelon',  name: 'Pastèque',    color: '#3ECFB0', letter: 'Pa' },
] as const;

type FruitId = (typeof FRUITS)[number]['id'];

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1];

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PicassoPalette() {
  const t = useTranslations('palette');
  const { addItem, openCart } = useCart();
  const [selected, setSelected] = useState<FruitId[]>([]);

  const toggle = (id: FruitId) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : prev.length < 3 ? [...prev, id] : prev
    );

  const selectedFruits  = FRUITS.filter(f => selected.includes(f.id));
  const fillPercent     = (selected.length / 3) * 100;
  const fruitColors     = selectedFruits.map(f => f.color);
  const blendColor      = selectedFruits[Math.floor(selectedFruits.length / 2)]?.color ?? '#FF5A1F';

  const handleOrderPalette = () => {
    if (!selectedFruits.length) return;
    const sortedIds = [...selected].sort();
    addItem({
      id:     `palette-${sortedIds.join('-')}`,
      name:   selectedFruits.map(f => f.name).join(' × '),
      format: 'Palette · 500ml',
      price:  PALETTE_PRICE,
      color:  blendColor,
      fruits: selectedFruits.map(f => f.name),
    });
    openCart();
  };

  return (
    <section
      id="palette"
      className="relative py-16 lg:py-28 px-4 sm:px-6 overflow-hidden bg-[#FFF8F0]/95"
    >
      {/* Dynamic colour orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[90px] transition-all duration-700 pointer-events-none"
        style={{ background: blendColor }}
      />

      <div className="relative max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: SPRING }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-coral/10 border border-coral/20 text-coral text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
            {t('badge')}
          </span>
          <h2 className="font-playfair text-[clamp(2.2rem,5vw,4rem)] font-bold text-warm leading-tight mb-4">
            {t('title')} <span className="italic text-coral">{t('highlight')}</span>
          </h2>
          <p className="text-warm/45 text-lg max-w-md mx-auto leading-relaxed">{t('subtitle')}</p>
        </motion.div>

        {/* Two-column layout: fruit selector | bottle */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {/* Left: fruit picker */}
          <div>
            {/* Counter dots */}
            <div className="flex items-center gap-2 mb-7">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{
                    scale:           i < selected.length ? 1.25 : 1,
                    backgroundColor: i < selected.length ? selectedFruits[i]?.color ?? '#FF5A1F' : '#1A0A0015',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-3 h-3 rounded-full border border-warm/10"
                />
              ))}
              <span className="text-warm/30 text-xs ml-1.5">{selected.length} / 3 fruits</span>
            </div>

            {/* Fruit grid */}
            <div className="grid grid-cols-4 gap-3">
              {FRUITS.map((fruit, i) => {
                const isSel      = selected.includes(fruit.id);
                const isDisabled = !isSel && selected.length >= 3;

                return (
                  <motion.button
                    key={fruit.id}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 280, damping: 22 }}
                    whileHover={isDisabled ? {} : { scale: 1.1, y: -3 }}
                    whileTap={isDisabled  ? {} : { scale: 0.93 }}
                    onClick={() => !isDisabled && toggle(fruit.id)}
                    disabled={isDisabled}
                    aria-pressed={isSel}
                    className="relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer"
                    style={
                      isSel
                        ? { background: `${fruit.color}18`, borderColor: `${fruit.color}70`, boxShadow: `0 0 20px ${fruit.color}28` }
                        : isDisabled
                        ? { background: '#1A0A0005', borderColor: 'transparent', opacity: 0.3, cursor: 'not-allowed' }
                        : { background: '#1A0A0005', borderColor: 'transparent' }
                    }
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md"
                      style={{ background: fruit.color, boxShadow: isSel ? `0 4px 14px ${fruit.color}55` : undefined }}
                    >
                      {fruit.letter}
                    </div>
                    <span className="text-warm/55 text-[9px] font-medium leading-tight text-center">{fruit.name}</span>

                    <AnimatePresence>
                      {isSel && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-warm flex items-center justify-center shadow-md"
                        >
                          <CheckIcon />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* Hint */}
            <p className="text-warm/25 text-xs mt-5">{t('hint')}</p>
          </div>

          {/* Right: animated bottle */}
          <div className="flex flex-col items-center gap-6">
            <AnimatedBottle colors={fruitColors} fillPercent={fillPercent} />

            {/* Order panel */}
            <AnimatePresence mode="wait">
              {selectedFruits.length > 0 ? (
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: SPRING }}
                  className="w-full max-w-xs bg-white border border-warm/10 rounded-2xl p-5 shadow-md shadow-warm/5 text-center"
                >
                  <p className="text-warm/35 text-xs uppercase tracking-widest mb-1">{t('creationLabel')}</p>
                  <p className="font-playfair text-warm text-lg font-bold mb-1 leading-snug">
                    {selectedFruits.map(f => f.name).join(' × ')}
                  </p>
                  <p className="font-playfair text-warm/40 text-sm mb-4">
                    {PALETTE_PRICE.toFixed(3).replace('.', ',')}
                    <span className="text-warm/30 text-xs ml-1">TND · 500ml</span>
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleOrderPalette}
                    className="w-full font-semibold py-3 rounded-xl cursor-pointer text-white"
                    style={{ background: blendColor, boxShadow: `0 6px 20px ${blendColor}38` }}
                  >
                    {t('order')}
                  </motion.button>
                  <button
                    onClick={() => setSelected([])}
                    className="mt-3 w-full text-warm/25 hover:text-warm/50 text-xs py-1.5 transition-colors cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="text-warm/25 text-sm">← Choisissez vos fruits</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
