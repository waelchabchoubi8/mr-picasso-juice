'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onDone: () => void;
}

// Animated chef flipping food with a spatula (pure SVG + Framer Motion).
function ChefCooking() {
  return (
    <svg viewBox="0 0 180 200" className="w-44 h-48" fill="none">
      {/* steam rising from the pan */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${18 + i * 11} 128 q-5 -8 0 -16 q5 -8 0 -16`}
          stroke="#C9A86A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.5, 0], y: [4, -18] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
        />
      ))}

      {/* gentle body bob */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* toque */}
        <circle cx="63" cy="42" r="12" fill="#fff" stroke="#E8DDD4" strokeWidth="2" />
        <circle cx="97" cy="42" r="12" fill="#fff" stroke="#E8DDD4" strokeWidth="2" />
        <circle cx="80" cy="34" r="15" fill="#fff" stroke="#E8DDD4" strokeWidth="2" />
        <rect x="61" y="48" width="38" height="14" rx="4" fill="#fff" stroke="#E8DDD4" strokeWidth="2" />

        {/* head */}
        <circle cx="80" cy="80" r="18" fill="#E8B083" />
        <circle cx="73.5" cy="78" r="2.1" fill="#3a2a20" />
        <circle cx="86.5" cy="78" r="2.1" fill="#3a2a20" />
        <path d="M72 88 Q80 94 88 88" stroke="#6b4326" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* dark shirt / torso */}
        <path d="M61 98 C61 96 99 96 99 98 L106 152 C106 161 54 161 54 152 Z" fill="#2B2B2B" />
        {/* red apron */}
        <path d="M70 104 L90 104 L95 152 C95 158 65 158 65 152 Z" fill="#CE2029" />
        <circle cx="80" cy="130" r="7" fill="#fff" opacity="0.85" />
        <circle cx="80" cy="130" r="3.4" fill="#CE2029" />

        {/* left arm holding the pan */}
        <path d="M62 108 C47 114 39 126 37 136" stroke="#E8B083" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="30" cy="140" rx="22" ry="6" fill="#333" />
        <ellipse cx="30" cy="137" rx="18" ry="4" fill="#1f1f1f" />
        <rect x="50" y="137" width="24" height="5" rx="2.5" fill="#333" />

        {/* flipping patty */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.2 }}
        >
          <ellipse cx="30" cy="134" rx="9" ry="3.4" fill="#E0A92E" />
        </motion.g>

        {/* right arm + spatula (small flipping motion) */}
        <motion.g
          style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
          animate={{ rotate: [-7, 5, -7] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M99 108 C116 112 126 122 130 132" stroke="#E8B083" strokeWidth="9" strokeLinecap="round" />
          <rect x="128" y="116" width="4.5" height="20" rx="2" fill="#8a5a2b" transform="rotate(38 130 126)" />
          <rect x="134" y="104" width="15" height="11" rx="2.5" fill="#d0d0d0" transform="rotate(38 141 109)" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [fill,  setFill]  = useState(0);
  const [exit,  setExit]  = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const DURATION = 2400; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const raw      = (now - start) / DURATION;
      const progress = Math.min(raw, 1);
      // Ease in-out cubic
      const eased = progress < 0.5
        ? 4 * progress ** 3
        : 1 - (-2 * progress + 2) ** 3 / 2;

      setFill(eased * 100);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExit(true);
          setTimeout(onDone, 800);
        }, 350);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="loader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-cream"
        >
          {/* Brand logo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Soltana Pro Max" width={120} height={120} className="w-28 h-28 rounded-2xl object-cover shadow-xl shadow-coral/20" />
            <p className="text-warm/35 text-xs tracking-[0.3em] uppercase">Sfax · Tunisie</p>
          </motion.div>

          {/* Cooking chef */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ChefCooking />
          </motion.div>

          {/* Percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="w-36 h-px bg-warm/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-coral rounded-full origin-left"
                animate={{ width: `${fill}%` }}
                transition={{ ease: 'linear', duration: 0.05 }}
              />
            </div>
            <span className="text-warm/30 text-xs tabular-nums">
              {Math.round(fill)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
