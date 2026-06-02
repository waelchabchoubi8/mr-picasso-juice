'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCurrency, type Region } from './CurrencyContext';

// ─── Module-level precomputed decoration (hydration-safe: no random/trig in render) ─

const FLOATERS = [
  { e: '🫙', x: '9%',  y: '16%', d: 0,   dur: 7.5 },
  { e: '🌶️', x: '85%', y: '20%', d: 0.6, dur: 8.5 },
  { e: '🥘', x: '16%', y: '72%', d: 1.1, dur: 6.8 },
  { e: '🧆', x: '80%', y: '74%', d: 1.5, dur: 7.2 },
  { e: '🇹🇳', x: '6%', y: '46%', d: 0.3, dur: 9.5 },
  { e: '🌍', x: '90%', y: '52%', d: 0.9, dur: 8.0 },
] as const;

const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
  left:  6 + ((i * 6.1) % 88),
  x:     (i % 2 ? 1 : -1) * (18 + (i % 6) * 13),
  rot:   (i % 2 ? 1 : -1) * (40 + i * 11),
  delay: i * 0.025,
  dur:   0.9 + (i % 3) * 0.16,
  rise:  90 + (i % 5) * 22,
}));
const CONFETTI_COLORS = ['#CE2029', '#FFD34E', '#3ECFB0', '#7ED95A', '#ffffff'];

const REVEAL_DELAY = 720; // ms of celebration before the gate slides away

// ─── Waving Ali (left.png / right.png). mix-blend-multiply drops the light photo
//     background into the cream backdrop so he reads as a cut-out figure. ───────────

function Ali({
  src, side, active, celebrating, reduce, className,
}: {
  src: string;
  side: 'left' | 'right';
  active: boolean;
  celebrating: boolean;
  reduce: boolean;
  className?: string;
}) {
  const sign = side === 'left' ? -1 : 1;

  // Idle: gentle "waving" sway. Active (its card hovered): leans in + lifts.
  // Celebrating (a choice was made): a happy jump.
  const animate = reduce
    ? { opacity: 1 }
    : celebrating
      ? { y: [0, -34, 0], rotate: [0, sign * 6, 0], scale: 1.06 }
      : active
        ? { y: -14, rotate: sign * 5, scale: 1.07 }
        : { y: [0, -7, 0], rotate: [sign * 2.5, sign * -2.5, sign * 2.5] };

  const transition = reduce
    ? { duration: 0.2 }
    : celebrating
      ? { duration: 0.6, ease: 'easeInOut' as const }
      : active
        ? { type: 'spring' as const, stiffness: 260, damping: 14 }
        : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: sign * 80, y: 40 }}
      animate={{ opacity: 1, x: 0, ...(typeof animate === 'object' ? animate : {}) }}
      transition={reduce ? { duration: 0.3 } : { ...transition, opacity: { duration: 0.5, delay: 0.35 }, x: { type: 'spring', stiffness: 120, damping: 18, delay: 0.35 } }}
      className={className}
      style={{ transformOrigin: 'bottom center' }}
    >
      {/* glow that warms when his side is active */}
      <motion.span
        aria-hidden
        animate={{ opacity: active || celebrating ? 0.5 : 0.2, scale: active || celebrating ? 1.1 : 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-x-2 bottom-2 top-8 rounded-full blur-2xl -z-10"
        style={{ background: side === 'left' ? '#CE2029' : '#E6A800' }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Ali 5lega Zehya"
        className="w-full h-full object-contain select-none pointer-events-none drop-shadow-xl"
        style={{ mixBlendMode: 'multiply' }}
        draggable={false}
      />
    </motion.div>
  );
}

// ─── Choice card ────────────────────────────────────────────────────────────────

function ChoiceCard({
  emoji, label, desc, accent, glow, picked, dimmed, reduce, onClick, onHover, onLeave,
}: {
  emoji: string;
  label: string;
  desc: string;
  accent: string;
  glow: string;
  picked: boolean;
  dimmed: boolean;
  reduce: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={reduce ? {} : { y: -6, scale: 1.03 }}
      whileTap={reduce ? {} : { scale: 0.97 }}
      animate={{
        opacity: dimmed ? 0.45 : 1,
        scale: picked ? 1.06 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex flex-col items-center gap-2 w-40 sm:w-52 px-5 py-7 sm:py-8 rounded-3xl border-2 bg-white/80 backdrop-blur-sm cursor-pointer overflow-hidden"
      style={{
        borderColor: picked ? accent : `${accent}33`,
        boxShadow: picked ? `0 18px 50px ${glow}55` : `0 8px 30px ${glow}1f`,
      }}
    >
      {/* fill sweep on hover/pick */}
      <span
        className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(120% 90% at 50% 0%, ${accent}14, transparent 70%)` }}
      />

      <motion.span
        animate={reduce ? {} : { y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative text-5xl sm:text-6xl leading-none"
      >
        {emoji}
      </motion.span>

      <span className="relative font-playfair font-bold text-warm text-base sm:text-lg leading-tight text-center mt-1">
        {label}
      </span>
      <span
        className="relative text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: `${accent}14`, color: accent }}
      >
        {desc}
      </span>

      {/* check badge when picked */}
      <AnimatePresence>
        {picked && (
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
            style={{ background: accent }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Gate ─────────────────────────────────────────────────────────────────────

export function RegionGate() {
  const t = useTranslations('region');
  const { setRegion } = useCurrency();
  const reduceRaw = useReducedMotion();
  const reduce = !!reduceRaw;

  const [picked, setPicked] = useState<Region | null>(null);
  const [hover, setHover]   = useState<Region | null>(null);

  const choose = (r: Region) => {
    if (picked) return; // ignore double-clicks during the celebration beat
    setPicked(r);
    if (reduce) {
      setRegion(r);
    } else {
      // let the celebration play, then commit → AnimatePresence slides the gate away
      setTimeout(() => setRegion(r), REVEAL_DELAY);
    }
  };

  const focus = picked ?? hover; // which side Ali reacts to
  const bubble =
    focus === 'tn'   ? t('aliTn')
    : focus === 'intl' ? t('aliIntl')
    : t('aliHi');

  return (
    <motion.div
      key="region-gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { y: '-100%' }}
      transition={reduce ? { duration: 0.2 } : { duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden px-5"
      style={{ background: 'linear-gradient(150deg, #FFFBF5 0%, #FFF1DA 45%, #FFEDEC 100%)' }}
    >
      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-coral/10 blur-[110px]" />
        <div className="absolute bottom-[-15%] left-[10%] w-80 h-80 rounded-full bg-sunny/15 blur-[90px]" />
        <div className="absolute top-1/3 right-[8%] w-72 h-72 rounded-full bg-teal/10 blur-[80px]" />
      </div>

      {/* floating food / flags */}
      {!reduce && FLOATERS.map((f, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute text-3xl sm:text-4xl opacity-40 pointer-events-none select-none"
          style={{ left: f.x, top: f.y }}
          animate={{ y: [0, -16, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: f.dur, repeat: Infinity, ease: 'easeInOut', delay: f.d }}
        >
          {f.e}
        </motion.span>
      ))}

      {/* confetti burst on pick */}
      <AnimatePresence>
        {picked && !reduce && (
          <div className="absolute inset-x-0 top-[18%] z-30 pointer-events-none">
            {CONFETTI.map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
                animate={{ opacity: [0, 1, 0], y: -c.rise, x: c.x, rotate: c.rot }}
                transition={{ duration: c.dur, delay: c.delay, ease: 'easeOut' }}
                className="absolute top-0 w-2.5 h-2.5 rounded-[2px]"
                style={{ left: `${c.left}%`, background: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── Ali, both sides ── */}
      <Ali
        src="/left.png"
        side="left"
        active={focus === 'tn'}
        celebrating={picked !== null}
        reduce={reduce}
        className="absolute bottom-0 left-0 sm:left-2 w-28 h-40 sm:w-44 sm:h-64 z-20"
      />
      <Ali
        src="/right.png"
        side="right"
        active={focus === 'intl'}
        celebrating={picked !== null}
        reduce={reduce}
        className="absolute bottom-0 right-0 sm:right-2 w-28 h-40 sm:w-44 sm:h-64 z-20"
      />

      {/* ── Center content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Soltana Pro Max" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-xl shadow-coral/25" />
        </motion.div>

        {/* Ali speech bubble */}
        <div className="h-9 mt-4 flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={bubble}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="inline-block bg-white text-warm text-sm font-semibold px-4 py-1.5 rounded-full shadow-md shadow-warm/10 border border-warm/8"
            >
              {bubble}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-coral text-[11px] font-bold tracking-[0.25em] uppercase mt-5"
        >
          {t('welcome')}
        </motion.p>
        <motion.h1
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="font-playfair text-3xl sm:text-4xl font-bold text-warm leading-tight mt-1"
        >
          {t('question')}
        </motion.h1>
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-warm/45 text-sm mt-2 max-w-xs"
        >
          {t('subtitle')}
        </motion.p>

        {/* Choice cards */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 22 }}
          className="flex items-stretch justify-center gap-4 sm:gap-6 mt-9"
        >
          <ChoiceCard
            emoji="🇹🇳"
            label={t('tnLabel')}
            desc={t('tnDesc')}
            accent="#CE2029"
            glow="#CE2029"
            picked={picked === 'tn'}
            dimmed={picked === 'intl'}
            reduce={reduce}
            onClick={() => choose('tn')}
            onHover={() => !picked && setHover('tn')}
            onLeave={() => !picked && setHover(null)}
          />
          <ChoiceCard
            emoji="🌍"
            label={t('intlLabel')}
            desc={t('intlDesc')}
            accent="#E6A800"
            glow="#FFD34E"
            picked={picked === 'intl'}
            dimmed={picked === 'tn'}
            reduce={reduce}
            onClick={() => choose('intl')}
            onHover={() => !picked && setHover('intl')}
            onLeave={() => !picked && setHover(null)}
          />
        </motion.div>

        {/* Ali credit */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-warm/30 text-[11px] mt-8"
        >
          👋 {t('aliName')}
        </motion.p>
      </div>
    </motion.div>
  );
}
