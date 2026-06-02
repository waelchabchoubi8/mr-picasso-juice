'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimationControls, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCart } from './CartContext';
import { useCurrency } from './CurrencyContext';
import { ChefMascot, SpeechBubble, MascotBadge, type Mood, type ChefAction } from './Mascot';

// ─── Data ─────────────────────────────────────────────────────────────────────

const BOXES = [
  { size: 10, price: 75,  per: 7.5 },
  { size: 15, price: 105, per: 7.0, popular: true },
  { size: 20, price: 130, per: 6.5 },
] as const;

const BASE_PER = 7.5; // reference rate (smallest box) for savings calc

const DISHES = [
  { id: 'mloukhiya', name: 'Mloukhiya',     color: '#2E5E3A' },
  { id: 'kleya',     name: 'Kleya',         color: '#7A3B28' },
  { id: 'chakchouka',name: 'Chakchouka',    color: '#D9482B' },
  { id: 'ojja',      name: 'Ojja',          color: '#E2542E' },
  { id: 'couscous',  name: 'Couscous',      color: '#E0A92E' },
  { id: 'lablabi',   name: 'Lablabi',       color: '#C9A86A' },
  { id: 'mechouia',  name: 'Slata Méchouia',color: '#6E8B3D' },
  { id: 'harissa',   name: 'Harissa',       color: '#C42A1C' },
] as const;

type DishId = (typeof DISHES)[number]['id'];

const DISH_COLOR: Record<string, string> = Object.fromEntries(DISHES.map(d => [d.id, d.color]));

const SPRING: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Module-level precomputed particle offsets (hydration-safe — no trig/random in render).
const PUFF = [
  { x: -7, y: -9,  s: 0.9 },
  { x: 7,  y: -11, s: 0.7 },
  { x: 0,  y: -13, s: 0.85 },
];
const CONFETTI = Array.from({ length: 10 }, (_, i) => ({
  x:     (i % 2 === 0 ? -1 : 1) * (14 + (i % 5) * 11),
  rot:   (i % 2 === 0 ? -1 : 1) * (20 + i * 8),
  delay: i * 0.04,
  dur:   0.9 + (i % 3) * 0.12,
  rise:  60 + (i % 4) * 14,
}));
const CONFETTI_COLORS = ['#FFD34E', '#CE2029', '#2E5E3A', '#E0A92E', '#D9482B'];

// ─── A single tin landing in the crate ──────────────────────────────────────────

function CanSlot({ color, reduce }: { color: string; reduce: boolean }) {
  return (
    <motion.div
      layout
      initial={reduce ? { opacity: 0, scale: 0.8 } : { y: -22, x: -10, rotate: -12, scale: 0.6, opacity: 0 }}
      animate={{ y: 0, x: 0, rotate: 0, scale: 1, opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { scale: 0, y: 8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className="relative aspect-[3/4]"
    >
      {/* the tin */}
      <div className="absolute inset-0 rounded-md overflow-hidden shadow-sm" style={{ background: color }}>
        <span className="absolute top-0 inset-x-0 h-[5px] bg-white/35" />
        <span className="absolute inset-x-[3px] top-[42%] h-[34%] rounded-[2px] bg-white/20" />
        <span className="absolute top-1 left-1 w-[3px] h-[60%] rounded-full bg-white/25" />
      </div>
      {/* landing ring-ping */}
      {!reduce && (
        <motion.span
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.65, opacity: 0 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          className="absolute inset-0 rounded-md border-2 pointer-events-none"
          style={{ borderColor: color }}
        />
      )}
      {/* steam puff */}
      {!reduce && PUFF.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.55, x: 0, y: 0, scale: p.s }}
          animate={{ opacity: 0, x: p.x, y: p.y }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: 'easeOut' }}
          className="absolute left-1/2 top-0 w-1.5 h-1.5 -ml-0.5 rounded-full bg-white/70 pointer-events-none"
        />
      ))}
    </motion.div>
  );
}

// ─── Stepper ───────────────────────────────────────────────────────────────────

function Stepper({
  value, onDec, onInc, color, canInc, disabled,
}: {
  value: number; onDec: () => void; onInc: () => void; color: string; canInc: boolean; disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <button
        onClick={onDec}
        disabled={disabled || value === 0}
        aria-label="−"
        className="w-6 h-6 rounded-full flex items-center justify-center border border-warm/15 text-warm/55 hover:text-warm hover:border-warm/35 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
      <span className="w-5 text-center font-bold text-warm text-sm tabular-nums">{value}</span>
      <button
        onClick={onInc}
        disabled={disabled || !canInc}
        aria-label="+"
        className="w-6 h-6 rounded-full flex items-center justify-center text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
        style={{ background: color }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

type Can = { id: number; dish: DishId };

export default function CoffretBuilder() {
  const t = useTranslations('builder');
  const { addItem, openCart } = useCart();
  const { amount, symbol, code } = useCurrency();
  const reduceRaw = useReducedMotion();
  const reduce = !!reduceRaw;

  const [size, setSize]   = useState<number | null>(null);
  const [cans, setCans]   = useState<Can[]>([]);
  const [react, setReact] = useState<{ nonce: number; action: ChefAction }>({ nonce: 0, action: null });
  const [showConfetti, setShowConfetti] = useState(false);

  const nextId        = useRef(1);
  const prevFull      = useRef(false);
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const crateCtrl     = useAnimationControls();

  // ── Derived ──────────────────────────────────────────────────────────────
  const totalCans = cans.length;
  const remaining = size === null ? 0 : size - totalCans;
  const isFull    = size !== null && totalCans === size;
  const box       = BOXES.find(b => b.size === size) ?? null;

  const counts: Record<string, number> = {};
  cans.forEach(c => { counts[c.dish] = (counts[c.dish] ?? 0) + 1; });

  const dominant = (() => {
    let best = 0, color = '#CE2029';
    for (const d of DISHES) { const c = counts[d.id] ?? 0; if (c > best) { best = c; color = d.color; } }
    return color;
  })();

  const composition = DISHES.filter(d => counts[d.id]).map(d => `${counts[d.id]} × ${d.name}`);

  const p = size ? totalCans / size : 0;
  const mood: Mood = size === null ? 'none' : isFull ? 'full' : p < 0.25 ? 'skeptical' : p < 0.6 ? 'warming' : 'intoit';

  const bubble: { text: string; id: string } = (() => {
    switch (mood) {
      case 'none':      return { text: t('chef.start'),     id: 'none' };
      case 'skeptical': return { text: t('chef.skeptical'), id: 'skeptical' };
      case 'warming': {
        const arr = t.raw('chef.warming') as string[];
        return { text: arr[totalCans % arr.length], id: `warming-${totalCans}` };
      }
      case 'intoit':    return { text: t('chef.intoIt', { remaining }), id: `intoit-${remaining}` };
      case 'full':      return { text: t('chef.perfect'),  id: 'full' };
    }
  })();

  // ── Actions ────────────────────────────────────────────────────────────────
  const bump = (action: ChefAction) => setReact(r => ({ nonce: r.nonce + 1, action }));

  // Celebrate a completed box — confetti + crate wobble (gated by reduced motion).
  const celebrate = () => {
    if (reduce) return;
    setShowConfetti(true);
    crateCtrl.start({ rotate: [0, -1.2, 1.2, 0], transition: { duration: 0.5 } });
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    confettiTimer.current = setTimeout(() => setShowConfetti(false), 1100);
  };

  // Fires once when the box becomes full (false→true). The full→full case
  // (shrinking an already-full box to a smaller, still-full one) is handled in chooseSize.
  useEffect(() => {
    if (isFull && !prevFull.current) celebrate();
    prevFull.current = isFull;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFull]);

  // Clear any pending confetti timer on unmount.
  useEffect(() => () => { if (confettiTimer.current) clearTimeout(confettiTimer.current); }, []);

  const setDish = (id: DishId, delta: number) => {
    if (size === null) return;
    if (delta > 0) {
      if (cans.length >= size) return;
      setCans(prev => [...prev, { id: nextId.current++, dish: id }]);
      bump('add');
      if (!reduce) crateCtrl.start({ y: [0, 2, 0], transition: { duration: 0.14 } });
    } else {
      setCans(prev => {
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].dish === id) return prev.filter((_, j) => j !== i);
        }
        return prev;
      });
      bump('remove');
    }
  };

  const chooseSize = (s: number) => {
    // If trimming an already-full box to a smaller (still-full) size, isFull stays
    // true → the completion effect won't re-fire, so celebrate the new box here.
    const nowFull = Math.min(cans.length, s) === s;
    setSize(s);
    setCans(prev => prev.slice(0, s));
    prevFull.current = nowFull;
    if (nowFull) celebrate();
    bump('size');
  };

  const reset = () => { setCans([]); bump('reset'); };

  const handleAdd = () => {
    if (!isFull || !box) return;
    const key = DISHES.filter(d => counts[d.id]).map(d => `${d.id}${counts[d.id]}`).join('-');
    addItem({
      id:     `coffret-${box.size}-${key}`,
      name:   `Coffret ${box.size} conserves`,
      format: `Coffret · ${box.size} pièces`,
      price:  box.price,
      color:  dominant,
      fruits: composition,
    });
    openCart();
    setCans([]); setSize(null); prevFull.current = false; bump('reset');
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      id="palette"
      className="relative py-16 lg:py-28 px-4 sm:px-6 overflow-hidden bg-[#FFF8F0]/95"
    >
      {/* Dynamic colour orb — warms toward the dominant dish */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[90px] pointer-events-none ${reduce ? '' : 'transition-colors duration-700'}`}
        style={{ background: dominant }}
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

        {/* ── Step 1: size selector ── */}
        <div className="mb-10">
          <p className="text-warm/40 text-xs font-semibold uppercase tracking-widest mb-4">{t('chooseSize')}</p>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {BOXES.map(b => {
              const selected = size === b.size;
              const save = Math.round((BASE_PER - b.per) * b.size);
              return (
                <motion.button
                  key={b.size}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => chooseSize(b.size)}
                  className="relative flex flex-col items-center gap-1 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer"
                  style={selected
                    ? { borderColor: '#CE2029', background: '#CE20290C', boxShadow: '0 8px 26px #CE202922' }
                    : { borderColor: '#1A0A0010', background: '#fff' }}
                >
                  {'popular' in b && b.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-coral text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                      {t('popular')}
                    </span>
                  )}
                  <span className="font-playfair text-3xl sm:text-4xl font-bold text-warm leading-none">{b.size}</span>
                  <span className="text-warm/40 text-[10px] uppercase tracking-wider">{t('cans')}</span>
                  <span className="font-playfair font-bold text-warm text-sm mt-1.5">{amount(b.price)} <span className="text-warm/40 text-[10px] font-normal">{symbol}</span></span>
                  {save > 0 ? (
                    <span className="text-[9px] font-semibold text-[#4FA82E] mt-0.5">{t('save')} {code === 'EUR' ? amount(save) : save} {symbol}</span>
                  ) : (
                    <span className="text-[9px] text-warm/30 mt-0.5">{amount(b.per)} / {t('cans').replace(/s$/, '')}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Step 2 + crate stage ── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">

          {/* Left: dish picker */}
          <div className={size === null ? 'opacity-40 pointer-events-none transition-opacity' : 'transition-opacity'}>
            {/* progress header (with mobile chef badge) */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-warm/40 text-xs font-semibold uppercase tracking-widest">{t('fillBox')}</p>
              {size !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-warm/45 text-xs font-medium tabular-nums">
                    {totalCans} / {size} {t('cans')}
                  </span>
                  <span className="lg:hidden">
                    <MascotBadge reactNonce={react.nonce} color={dominant} />
                  </span>
                </div>
              )}
            </div>

            {/* progress bar */}
            <div className="h-1.5 rounded-full bg-warm/8 overflow-hidden mb-5">
              <motion.div
                className="h-full w-full rounded-full origin-left"
                style={{ background: dominant }}
                animate={{ scaleX: size ? totalCans / size : 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 26 }}
              />
            </div>

            {/* dish list */}
            <div className="flex flex-col gap-2">
              {DISHES.map((d, i) => {
                const c = counts[d.id] ?? 0;
                return (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: SPRING }}
                    className="flex items-center gap-3 p-2.5 rounded-xl border transition-colors"
                    style={c > 0
                      ? { background: `${d.color}10`, borderColor: `${d.color}40` }
                      : { background: '#fff', borderColor: '#1A0A0010' }}
                  >
                    <motion.span
                      key={c}
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                      className="w-7 h-7 rounded-lg flex-shrink-0 shadow-sm"
                      style={{ background: d.color }}
                    />
                    <span className="flex-1 min-w-0 text-warm text-[13px] font-semibold truncate">{d.name}</span>
                    <Stepper
                      value={c}
                      color={d.color}
                      canInc={size !== null && totalCans < size}
                      disabled={size === null}
                      onDec={() => setDish(d.id, -1)}
                      onInc={() => setDish(d.id, +1)}
                    />
                  </motion.div>
                );
              })}
            </div>

            <p className="text-warm/25 text-xs mt-4">{t('hint')}</p>
          </div>

          {/* Right: chef + crate + order */}
          <div className="flex flex-col items-center gap-5 lg:sticky lg:top-28">

            {/* Chef + speech bubble */}
            <div className="w-full max-w-xs flex items-end gap-2.5 pl-1">
              <ChefMascot
                mood={mood}
                reactNonce={react.nonce}
                lastAction={react.action}
                isFull={isFull}
                className="w-24 sm:w-28 flex-shrink-0"
              />
              <SpeechBubble text={bubble.text} id={bubble.id} className="flex-1 pb-5" />
            </div>

            {/* Crate */}
            <div className="relative w-full max-w-xs">
              {/* completion confetti — sparse, slow rise */}
              {showConfetti && (
                <div className="absolute inset-x-0 top-1 z-30 pointer-events-none">
                  {CONFETTI.map((c, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                      animate={{ opacity: [0, 1, 0], x: c.x, y: -c.rise, rotate: c.rot }}
                      transition={{ duration: c.dur, delay: c.delay, ease: 'easeOut' }}
                      className="absolute left-1/2 top-0 w-2 h-2 rounded-[2px]"
                      style={{ background: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
                    />
                  ))}
                </div>
              )}

              <motion.div
                animate={crateCtrl}
                className="bg-gradient-to-b from-warm/[0.04] to-warm/[0.07] border rounded-3xl p-4 shadow-inner transition-colors duration-500"
                style={{ borderColor: isFull ? `${dominant}55` : '#1A0A0014', boxShadow: isFull ? `0 0 0 3px ${dominant}22, inset 0 2px 8px rgba(0,0,0,0.05)` : undefined }}
              >
                {size === null ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-warm/[0.06] flex items-center justify-center text-3xl">📦</div>
                    <p className="text-warm/35 text-sm max-w-[180px]">{t('emptyHint')}</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* empty slot outlines (static background) */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: size }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-md border-2 border-dashed border-warm/12 bg-warm/[0.015]" />
                      ))}
                    </div>
                    {/* filled tins overlaid in the same grid (popLayout → exits don't reflow the cells) */}
                    <div className="grid grid-cols-5 gap-1.5 absolute inset-0">
                      <AnimatePresence mode="popLayout">
                        {cans.map(can => (
                          <CanSlot key={can.id} color={DISH_COLOR[can.dish]} reduce={reduce} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Order panel */}
            <AnimatePresence mode="wait">
              {size !== null && (
                <motion.div
                  key="order"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: SPRING }}
                  className="w-full max-w-xs bg-white border border-warm/10 rounded-2xl p-5 shadow-md shadow-warm/5 text-center"
                >
                  <p className="text-warm/35 text-xs uppercase tracking-widest mb-1">{t('creationLabel')}</p>
                  {composition.length > 0 ? (
                    <p className="text-warm/55 text-xs leading-relaxed mb-3 px-1">
                      {composition.join(' · ')}
                    </p>
                  ) : (
                    <p className="text-warm/30 text-xs mb-3">—</p>
                  )}
                  <p className="font-playfair text-warm text-2xl font-bold mb-4">
                    {box ? amount(box.price) : '—'}
                    <span className="text-warm/35 text-xs font-normal ml-1">{symbol}</span>
                  </p>

                  <motion.button
                    whileHover={isFull ? { scale: 1.03 } : {}}
                    whileTap={isFull ? { scale: 0.97 } : {}}
                    onClick={handleAdd}
                    disabled={!isFull}
                    className="relative overflow-hidden w-full font-semibold py-3 rounded-xl cursor-pointer text-white transition-all duration-300 disabled:cursor-not-allowed"
                    style={isFull
                      ? { background: dominant, boxShadow: `0 6px 20px ${dominant}45` }
                      : { background: '#1A0A0018', color: '#1A0A0055' }}
                  >
                    <span className="relative z-10">
                      {isFull ? t('addToCart') : `${remaining} ${t('cans')} ${t('remaining')}`}
                    </span>
                    {isFull && !reduce && (
                      <motion.span
                        key="shimmer"
                        initial={{ x: '-130%' }}
                        animate={{ x: '230%' }}
                        transition={{ duration: 0.9, ease: 'easeInOut' }}
                        className="absolute inset-y-0 -left-1/4 w-1/3 bg-white/25 skew-x-12 pointer-events-none"
                      />
                    )}
                  </motion.button>

                  {totalCans > 0 && (
                    <button
                      onClick={reset}
                      className="mt-3 w-full text-warm/25 hover:text-warm/50 text-xs py-1.5 transition-colors cursor-pointer"
                    >
                      {t('reset')}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
