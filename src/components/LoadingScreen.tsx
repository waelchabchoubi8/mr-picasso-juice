'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onDone: () => void;
}

function JuiceGlass({ fillPercent }: { fillPercent: number }) {
  // Glass body: y=30 to y=178, height=148
  const bodyTop    = 30;
  const bodyBottom = 178;
  const bodyH      = bodyBottom - bodyTop;
  const fillH      = (fillPercent / 100) * bodyH;
  const fillY      = bodyBottom - fillH;

  // Liquid colour transitions coral → yellow based on fill
  const r1 = 255, g1 = 90,  b1 = 31;   // coral  #FF5A1F
  const r2 = 255, g2 = 211, b2 = 78;   // yellow #FFD34E
  const t  = fillPercent / 100;
  const r  = Math.round(r1 + (r2 - r1) * t);
  const g  = Math.round(g1 + (g2 - g1) * t);
  const b  = Math.round(b1 + (b2 - b1) * t);
  const liquidColor = `rgb(${r},${g},${b})`;

  return (
    <svg viewBox="0 0 120 200" className="w-32 h-52" fill="none">
      <defs>
        <clipPath id="glass-clip">
          <path d="M22 30 L98 30 L88 178 C88 184 32 184 32 178 Z" />
        </clipPath>
        <linearGradient id="shine-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
          <stop offset="50%"  stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="white" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Glass body outline */}
      <path d="M22 30 L98 30 L88 178 C88 184 32 184 32 178 Z"
        fill="white" fillOpacity="0.25" stroke="#E8DDD4" strokeWidth="1.5" />

      {/* Liquid fill */}
      <motion.rect
        x="22" width="76"
        animate={{ y: fillY, height: fillH }}
        transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.08 }}
        fill={liquidColor}
        opacity="0.9"
        clipPath="url(#glass-clip)"
      />

      {/* Liquid surface wave */}
      {fillPercent > 1 && (
        <motion.g clipPath="url(#glass-clip)">
          <motion.path
            d={`M22 ${fillY} Q46 ${fillY - 3} 60 ${fillY} Q74 ${fillY + 3} 98 ${fillY}`}
            stroke={liquidColor}
            strokeWidth="2"
            fill="none"
            opacity="0.7"
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.g>
      )}

      {/* Shine overlay */}
      <path d="M22 30 L98 30 L88 178 C88 184 32 184 32 178 Z"
        fill="url(#shine-grad)" />

      {/* Rim */}
      <rect x="18" y="26" width="84" height="8" rx="4"
        fill="white" fillOpacity="0.6" stroke="#E8DDD4" strokeWidth="1" />

      {/* Straw */}
      <rect x="76" y="0" width="5" height="110" rx="2.5"
        fill="#FF5A1F" opacity="0.8"
        transform="rotate(6 78 55)" />

      {/* Bubbles (only visible when filling) */}
      {fillPercent > 15 && [
        { cx: 45, cy: fillY + 20, r: 3, delay: 0    },
        { cx: 65, cy: fillY + 35, r: 2, delay: 0.4  },
        { cx: 55, cy: fillY + 15, r: 2, delay: 0.8  },
      ].map((b, i) => (
        <motion.circle key={i} cx={b.cx} r={b.r}
          fill="white" opacity="0.4"
          animate={{ cy: [b.cy, b.cy - 20], opacity: [0.4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: b.delay, ease: 'easeOut' }}
          clipPath="url(#glass-clip)"
        />
      ))}
    </svg>
  );
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [fill,  setFill]  = useState(0);
  const [exit,  setExit]  = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const DURATION = 2400; // ms for glass to fill
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
        // Brief pause then exit
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
          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <p className="font-playfair text-4xl font-bold text-warm tracking-tight">
              AIT <span className="italic text-coral">Juice</span>
            </p>
            <p className="text-warm/35 text-xs tracking-[0.3em] uppercase mt-1">Tunis · Tunisie</p>
          </motion.div>

          {/* Glass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <JuiceGlass fillPercent={fill} />
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
                className="h-full bg-coral rounded-full"
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
