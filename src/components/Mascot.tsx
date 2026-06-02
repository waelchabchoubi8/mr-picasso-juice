'use client';

import { useEffect, useRef } from 'react';
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useReducedMotion,
} from 'framer-motion';

export type Mood = 'none' | 'skeptical' | 'warming' | 'intoit' | 'full';
export type ChefAction = 'add' | 'remove' | 'size' | 'reset' | null;

// transform-origin near the base of the chest so a rotation reads as a HEAD TURN/NOD,
// not a body spin. Tune to the real /mascot.png neck position if needed.
const HEAD_ORIGIN = '50% 90%';

// Resting tilt/lean the chef settles into per mood (reactions ride on top of this).
const MOOD_BASE: Record<Mood, { tilt: number; lean: number }> = {
  none:      { tilt: 0,  lean: 0 },
  skeptical: { tilt: -4, lean: 0 },
  warming:   { tilt: 0,  lean: 2 },
  intoit:    { tilt: 3,  lean: 4 },
  full:      { tilt: 2,  lean: 2 },
};

const REACT_SPRING = { stiffness: 380, damping: 14, mass: 0.7 };

interface ChefMascotProps {
  mood: Mood;
  reactNonce: number;
  lastAction: ChefAction;
  isFull: boolean;
  className?: string;
}

export function ChefMascot({ mood, reactNonce, lastAction, isFull, className = '' }: ChefMascotProps) {
  const reduce = useReducedMotion();

  const tilt = useMotionValue(0);
  const lean = useMotionValue(0);
  const bob  = useMotionValue(0);
  const pop  = useMotionValue(1);
  const sTilt = useSpring(tilt, REACT_SPRING);
  const sLean = useSpring(lean, REACT_SPRING);
  const sBob  = useSpring(bob,  REACT_SPRING);
  const sPop  = useSpring(pop,  REACT_SPRING);

  // Mood baseline — the resting pose reactions return to.
  useEffect(() => {
    const base = MOOD_BASE[mood];
    tilt.set(base.tilt);
    lean.set(base.lean);
    bob.set(0);
    pop.set(isFull ? 1.04 : 1);
  }, [mood, isFull, tilt, lean, bob, pop]);

  // Per-action reaction — interruptible, latest wins (springs carry it home).
  useEffect(() => {
    if (reactNonce === 0) return;
    const base = MOOD_BASE[mood];

    if (reduce) {
      // Reduced motion: a tiny, instant acknowledgement, no bounce.
      tilt.set(base.tilt + (lastAction === 'remove' ? -2 : 2));
      const r = setTimeout(() => tilt.set(base.tilt), 140);
      return () => clearTimeout(r);
    }

    if (lastAction === 'add') {
      // lean over and place the tin: head dips down/toward the crate
      tilt.set(base.tilt + 6); lean.set(base.lean + 5); bob.set(5); pop.set(1.06);
    } else if (lastAction === 'remove') {
      // curt disapproval recoil: head pulls back/up
      tilt.set(base.tilt - 7); lean.set(base.lean - 3); bob.set(-2); pop.set(0.96);
    } else {
      // size / reset → a little shrug
      tilt.set(-5); lean.set(-3); bob.set(0); pop.set(0.97);
    }

    const reset = setTimeout(() => {
      tilt.set(base.tilt); lean.set(base.lean); bob.set(0); pop.set(isFull ? 1.04 : 1);
    }, 300);
    return () => clearTimeout(reset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactNonce]);

  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      {/* OUTER: idle "living portrait" breath loop */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -3, 0], rotate: [-1, 1, -1] }}
        transition={reduce ? undefined : { duration: 5, ease: 'easeInOut', repeat: Infinity }}
      >
        {/* INNER: spring-driven reactions, pivoting at the neck */}
        <motion.div style={{ rotate: sTilt, x: sLean, y: sBob, scale: sPop, transformOrigin: HEAD_ORIGIN }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot.png"
            alt="Chef Soltana"
            draggable={false}
            className="w-full h-auto select-none"
            style={{ filter: 'drop-shadow(0 12px 16px rgba(26,10,0,0.20))' }}
          />
        </motion.div>
      </motion.div>

      {/* Mood overlays near the head */}
      <AnimatePresence mode="wait">
        {mood === 'skeptical' && (
          <motion.span
            key="q"
            initial={{ opacity: 0, scale: 0.4, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-1 right-0 text-coral font-playfair font-bold text-lg"
          >
            ?
          </motion.span>
        )}
        {mood === 'intoit' && (
          <motion.span
            key="sweat"
            initial={{ opacity: 0, scale: 0, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 16 }}
            className="absolute top-3 right-1 text-sm"
            aria-hidden
          >
            💦
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Speech bubble ──────────────────────────────────────────────────────────────

export function SpeechBubble({ text, id, className = '' }: { text: string; id: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white border border-warm/10 rounded-2xl rounded-bl-sm px-3.5 py-2 shadow-md shadow-warm/5"
        >
          <p className="text-warm/75 text-[12px] leading-snug font-medium">{text}</p>
          {/* tail pointing down-left toward the chef */}
          <span className="absolute -bottom-1.5 left-3 w-3 h-3 bg-white border-b border-l border-warm/10 rotate-45 rounded-[2px]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Mobile face badge (lives in the progress header) ────────────────────────────

export function MascotBadge({ reactNonce, color }: { reactNonce: number; color: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      key={reduce ? undefined : reactNonce}
      animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="inline-flex w-7 h-7 rounded-full overflow-hidden ring-2 shadow-sm flex-shrink-0"
      style={{ borderColor: color, boxShadow: `0 0 0 2px ${color}33` }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mascot.png" alt="" className="w-full h-full object-cover object-top" draggable={false} />
    </motion.span>
  );
}
